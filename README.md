## My Project

## DockerImageDeployment

This module allows you to copy docker image assets to a repository you control. This can be necessary if you want to build a Docker image in one CDK app and consume it in a different app or outside the CDK, or if you want to apply a lifecycle policy to all images of a part of your application. 

### Example usage
```
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as imagedeploy from 'aws-cdk-lib/aws-docker-image-deployment';

const repo = new ecr.Repository.fromRepositoryName(this, 'ExampleRepository', 'examplerepository');

new imagedeploy.DockerImageDeployment(this, 'ExampleImageDeployment', {
  source: imagedeploy.Source.directory('path/to/directory'),
  destination: imagedeploy.Destination.ecr(repo)
});

```
#### Controlling the tag
```
new imagedeploy.DockerImageDeployment(this, 'ExampleImageDeploymentWithTag', {
  source: imagedeploy.Source.directory('path/to/directory'),
  destination: imagedeploy.Destination.ecr(repo, 'exampletag')
});
```

#### Under the hood
1. When this stack is deployed (either via cdk deploy or via CI/CD), the contents of the (local Docker) image will be archived and uploaded to an intermediary assets ECR Repository using the cdk-assets mechanism.
2. The `DockerImageDeployment` construct synthesizes a Codebuild Project which uses docker to pull the image from the intermediary repository, tag the image if a tag is provided, and push the image to the destination repository.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
