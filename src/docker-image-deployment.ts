//import * as path from 'path';
import { Stack } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
//import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { DestinationConfig } from './destination';
import { ISource, SourceConfig } from './source';


export interface DockerImageDeploymentProps {
  /**
   * Source of image to deploy.
   */
  readonly source: ISource;

  /**
   * Destination repository to deploy the image to.
   */
  readonly destination: DestinationConfig;
}

export class DockerImageDeployment extends Construct {
  private readonly cb: codebuild.Project;

  constructor(scope: Construct, id: string, props: DockerImageDeploymentProps) {
    super(scope, id);


    const codebuildrole = new iam.Role(this, 'codebuildroleUniqueID', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      roleName: 'codebuildrole',
    });
    codebuildrole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'ecr:BatchCheckLayerAvailability',
        'ecr:CompleteLayerUpload',
        'ecr:GetAuthorizationToken',
        'ecr:InitiateLayerUpload',
        'ecr:PutImage',
        'ecr:UploadLayerPart',
        'ecr:GetDownloadUrlForLayer',
        'ecr:BatchGetImage',
        'ecr:BatchCheckLayerAvailability',
      ],
      resources: ['*'],
    }));


    // should put these in a function

    // is this necessary?
    // try doing this without role
    // is this the right role if the bind is needed?
    const sourceConfig: SourceConfig = props?.source.bind(this, { handlerRole: codebuildrole });
    const sourceURI: string = sourceConfig.imageURI;

    let destURI: string = props.destination.destinationURI + ':';

    if (props.destination.destinationTag === undefined) {
      destURI += sourceConfig.imageTag;
    } else {
      destURI += props.destination.destinationTag;
    }

    // think about why we need these
    // will there need to be a logout and login for pushing somewhere else - probably, can address with source / dest interfaces
    const accountId: string = Stack.of(this).account;
    const region: string = Stack.of(this).region;


    const commandList = [
      `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
      `docker pull ${sourceURI}`,
      `docker tag ${sourceURI} ${destURI}`,
      `docker push ${destURI}`,
    ];


    // need to think about staging
    this.cb = new codebuild.Project(this, 'codebuildUniqueID', {
      buildSpec: codebuild.BuildSpec.fromObject({
        // version: '0.2'?
        version: '0.2',
        phases: {
          build: {
            commands: commandList,
          },
        },
      }),
      environment: { privileged: true, buildImage: codebuild.LinuxBuildImage.STANDARD_5_0 },
      role: codebuildrole,

    });

    new cr.AwsCustomResource(this, 'startcodebuildUniqueID', {
      onCreate: {
        service: 'CodeBuild',
        action: 'startBuild',
        parameters: {
          projectName: this.cb.projectName,
        },
        physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

  }
}