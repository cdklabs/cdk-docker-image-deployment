import { Stack, CustomResource, Duration } from 'aws-cdk-lib';
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
    props.destination.bind(handlerRole);

    const sourceUri = sourceConfig.imageUri;

    const destTag = props.destination.config.destinationTag ?? sourceConfig.imageTag;
    const destUri = `${props.destination.config.destinationUri}:${destTag}`;

    const accountId = Stack.of(this).account;
    const region = Stack.of(this).region;

    const sourceLoginCommands = [
      `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
    ];

    const buildCommands = [
      `docker pull ${sourceUri}`,
      `docker tag ${sourceUri} ${destUri}`,
      `docker push ${destUri}`,
    ];

    this.cb = new codebuild.Project(this, 'DockerImageDeployProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: sourceLoginCommands,
          },
          build: {
            commands: buildCommands,
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
      entry: 'lib/codebuild-handler/index.js',
      handler: 'onEventhandler',
      depsLockFilePath: 'yarn.lock',
      runtime: Runtime.NODEJS_16_X,
    });

    const isCompleteHandler = new lambda.NodejsFunction(this, 'isCompleteHandler', {
      entry: 'lib/codebuild-handler/index.js',
      handler: 'isCompleteHandler',
      depsLockFilePath: 'yarn.lock',
      runtime: Runtime.NODEJS_16_X,
    });


    // https://github.com/aws/aws-cdk/issues/21721 issue to add grant methods to codebuild
    iam.Grant.addToPrincipal({
      grantee: onEventHandler,
      actions: ['codebuild:StartBuild'],
      resourceArns: [this.cb.projectArn],
      scope: this,
    });

    iam.Grant.addToPrincipal({
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

    customResource.node.addDependency(handlerRole);
  }
}
