const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Parker Scanlon',
  authorAddress: 'pscanlo@amazon.com',
  cdkVersion: '2.37.1',
  defaultReleaseBranch: 'main',
  name: 'cdk-docker-image-deployment',
  repositoryUrl: 'git@github.com:scanlonp/cdk-docker-image-deployment.git',
  autoApproveUpgrades: true,
  autoApproveOptions: {},
  gitignore: ['/cdk.out', 'package-lock.json', 'hello.test.ts'],
  //deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['@aws-cdk/integ-tests-alpha'], /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  bundledDeps: ['@types/aws-lambda', 'aws-sdk'],
});
project.synth();
