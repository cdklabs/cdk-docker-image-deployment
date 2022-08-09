import { Stack } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { Destination } from './destination';
import { Source } from './source';

export interface DockerImageDeploymentProps {
  /**
   * Source of image to deploy.
   */
  readonly source: Source;

  /**
   * Destination repository to deploy the image to.
   */
  readonly destination: Destination;
}

export class DockerImageDeployment extends Construct {
  private readonly cb: codebuild.Project;

  constructor(scope: Construct, id: string, props: DockerImageDeploymentProps) {
    super(scope, id);

    const handlerRole = new iam.Role(this, 'DockerImageDeployRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      roleName: 'codebuildrole123',
    });

    props.destination.repository.grantPullPush(handlerRole);

    const sourceConfig = props.source.bind(this, { handlerRole });

    const sourceUri: string = sourceConfig.imageUri;

    const destTag: string = props.destination.config.destinationTag ?? sourceConfig.imageTag;
    const destUri: string = `${props.destination.config.destinationUri}:${destTag}`;

    const accountId: string = Stack.of(this).account;
    const region: string = Stack.of(this).region;

    const commandList = [
      `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
      `docker pull ${sourceUri}`,
      `docker tag ${sourceUri} ${destUri}`,
      `docker push ${destUri}`,
    ];

    this.cb = new codebuild.Project(this, 'DockerImageDeployProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: commandList,
          },
        },
      }),
      environment: {
        privileged: true,
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      role: handlerRole,
    });

    new cr.AwsCustomResource(this, 'DockerImageDeployCustomeResource', {
      onUpdate: {
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
