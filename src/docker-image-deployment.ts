import * as path from 'path';
import { CustomResource, Duration, CfnOutput, Token } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { Destination } from './destination';
import { Source } from './source';

export interface DockerImageDeploymentProps {
  /**
   * Source of the image to deploy.
   */
  readonly source: Source;

  /**
   * Destination repository to deploy the image to.
   */
  readonly destination: Destination;
}

/**
 * `DockerImageDeployment` pushes an image from a local or external source to a specified external destination
 */
export class DockerImageDeployment extends Construct {
  private readonly cb: codebuild.Project;

  constructor(scope: Construct, id: string, props: DockerImageDeploymentProps) {
    super(scope, id);

    const handlerRole = new iam.Role(this, 'DockerImageDeployRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    const sourceConfig = props.source.bind(this, { handlerRole });
    const destinationConfig = props.destination.bind(handlerRole);

    const sourceUri = sourceConfig.imageUri;

    const destTag = destinationConfig.destinationTag ?? sourceConfig.imageTag;
    this.validateTag(destTag);

    const destUri = `${destinationConfig.destinationUri}:${destTag}`;

    const commands = [
      sourceConfig.loginConfig.loginCommand,
      `docker pull ${sourceUri}`,
      `docker tag ${sourceUri} ${destUri}`,
    ];

    if (sourceConfig.loginConfig.region !== destinationConfig.loginConfig.region || !sourceConfig.loginConfig.region) { // different regions or either undefined should logout and login
      commands.push('docker logout');
      commands.push(destinationConfig.loginConfig.loginCommand);
    }

    commands.push(`docker push ${destUri}`);
    commands.push('docker logout');

    this.cb = new codebuild.Project(this, 'DockerImageDeployProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: commands,
          },
        },
      }),
      environment: {
        privileged: true,
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      role: handlerRole,
    });

    const onEventHandler = new lambda.NodejsFunction(this, 'onEventHandler', {
      entry: path.join(__dirname, 'codebuild-handler/index.ts'),
      handler: 'onEventhandler',
      runtime: Runtime.NODEJS_16_X,
    });

    const isCompleteHandler = new lambda.NodejsFunction(this, 'isCompleteHandler', {
      entry: path.join(__dirname, 'codebuild-handler/index.ts'),
      handler: 'isCompleteHandler',
      runtime: Runtime.NODEJS_16_X,
    });

    // https://github.com/aws/aws-cdk/issues/21721 issue to add grant methods to codebuild
    const grantOnEvent = iam.Grant.addToPrincipal({
      grantee: onEventHandler,
      actions: ['codebuild:StartBuild'],
      resourceArns: [this.cb.projectArn],
      scope: this,
    });

    const grantIsComplete = iam.Grant.addToPrincipal({
      grantee: isCompleteHandler,
      actions: [
        'codebuild:ListBuildsForProject',
        'codebuild:BatchGetBuilds',
      ],
      resourceArns: [this.cb.projectArn],
      scope: this,
    });

    const crProvider = new cr.Provider(this, 'CRProvider', {
      onEventHandler: onEventHandler,
      isCompleteHandler: isCompleteHandler,
      queryInterval: Duration.seconds(30),
      totalTimeout: Duration.minutes(30),
    });

    const customResource = new CustomResource(this, `CustomResource${Date.now().toString()}`, {
      serviceToken: crProvider.serviceToken,
      properties: {
        projectName: this.cb.projectName,
      },
    });

    customResource.node.addDependency(grantOnEvent, grantIsComplete);

    try {
      new CfnOutput(this, 'CustomResourceReport', {
        value: `${customResource.getAttString('Status')}, see the logs here: ${customResource.getAtt('LogsUrl')}`,
      });
    } catch (error) {
      throw new Error('Error getting the report from the custom resource');
    }
  }

  private validateTag(tag: string): void {
    if (Token.isUnresolved(tag)) {
      return; // if token tag is likely from source, so assume it is valid
    }
    if (tag.length > 128) {
      throw new Error (`Invalid tag: tags may contain a maximum of 128 characters; your tag ${tag} has ${tag.length} characters`);
    }
    if (!/^[^-.][a-zA-Z0-9-_.]+$/.test(tag)) {
      throw new Error(`Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'; your tag was ${tag}`);
    }
  }
}
