import * as path from 'path';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib/core';
import * as imagedeploy from '../src';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-1');

const repo = new ecr.Repository(stack, 'MyRepository');

const dockerimagedeploy = new imagedeploy.DockerImageDeployment(stack, 'MyDockerImageDeploy', {
  source: imagedeploy.Source.directory(path.join(__dirname, '../assets')),
  destination: imagedeploy.Destination.ecr(repo, {
    tag: 'mytag',
  }),
});

app.synth();