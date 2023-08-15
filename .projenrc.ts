import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Parker Scanlon',
  authorAddress: 'https://aws.amazon.com/',
  cdkVersion: '2.92.0', // needed for node18
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
  publishToPypi: {
    distName: 'cdk-docker-image-deployment',
    module: 'cdk_docker_image_deployment',
  },
  publishToMaven: {
    javaPackage: 'io.github.cdklabs.cdk.docker.image.deployment',
    mavenGroupId: 'io.github.cdklabs',
    mavenArtifactId: 'cdk-docker-image-deployment',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },
  publishToNuget: {
    dotNetNamespace: 'Cdklabs.CdkDockerImageDeployment',
    packageId: 'Cdklabs.CdkDockerImageDeployment',
  },
});

project.synth();
