import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Parker Scanlon',
  authorAddress: 'https://aws.amazon.com/',
  cdkVersion: '2.24.0', // needed for node16
  defaultReleaseBranch: 'main',
  name: 'cdk-docker-image-deployment',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/cdklabs/cdk-docker-image-deployment.git',
  homepage: 'https://github.com/cdklabs/cdk-docker-image-deployment#readme',
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['cdklabs-automation'],
    secret: 'GITHUB_TOKEN',
  },
  gitignore: ['/cdk.out'],
  description: 'This module allows you to copy docker image assets to a repository you control. This can be necessary if you want to build a Docker image in one CDK app and consume it in a different app or outside the CDK.',
  bundledDeps: ['@types/aws-lambda', 'aws-sdk'],
  devDeps: ['esbuild'],
  releaseEnvironment: 'release',
  npmTrustedPublishing: true,
  publishToPypi: {
    distName: 'cdk-docker-image-deployment',
    module: 'cdk_docker_image_deployment',
    trustedPublishing: true,
  },
  publishToMaven: {
    javaPackage: 'io.github.cdklabs.cdk.docker.image.deployment',
    mavenGroupId: 'io.github.cdklabs',
    mavenArtifactId: 'cdk-docker-image-deployment',
    mavenServerId: 'central-ossrh',
  },
  publishToNuget: {
    dotNetNamespace: 'Cdklabs.CdkDockerImageDeployment',
    packageId: 'Cdklabs.CdkDockerImageDeployment',
    trustedPublishing: true,
  },
});

project.synth();
