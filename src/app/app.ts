import { Stack, StackProps } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
import * as imagedeploy from '../index';

export class DockerImageDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repo = new ecr.Repository(this, 'mydockerimagedeploytestrepo', {
      repositoryName: 'nameofdidtestrepo',
    });

    new imagedeploy.DockerImageDeployment(this, 'imagedeploywithtag', {
      source: imagedeploy.Source.directory('src/assets'),
      destination: imagedeploy.Destination.ecr(repo, 'newtag2'),
    });
  }
}
