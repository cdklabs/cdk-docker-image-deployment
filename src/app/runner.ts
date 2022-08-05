#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DockerImageDeploymentStack } from './app';

const app = new cdk.App();
new DockerImageDeploymentStack(app, 'dockerimagedeployStack', {});
