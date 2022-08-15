import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib/core';
import * as imagedeploy from '../src';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'cdk-docker-image-deployment');

const repo = new ecr.Repository(stack, 'MyRepository');

new imagedeploy.DockerImageDeployment(stack, 'MyDockerImageDeploy', {
  source: imagedeploy.Source.directory(path.join(__dirname, '../assets')),
  destination: imagedeploy.Destination.ecr(repo, {
    tag: 'mytag',
  }),
});

new IntegTest(app, 'docker-image-deployment', {
  testCases: [stack],
});
