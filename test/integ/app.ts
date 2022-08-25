import * as path from 'path';
import { Stack, App } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
import * as imagedeploy from '../../lib/index';

const app = new App();

class DockerImageDeploymentStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const repo = new ecr.Repository(this, 'MyRepository', {
      repositoryName: 'myrepository',
    });

    new imagedeploy.DockerImageDeployment(this, 'MyImageDeployment', {
      source: imagedeploy.Source.directory(path.join(__dirname, '../assets/test1')),
      destination: imagedeploy.Destination.ecr(repo, {
        tag: 'myTag',
      }),
    });
  }
}

new DockerImageDeploymentStack(app, 'MyStack');