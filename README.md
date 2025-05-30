## CDK Docker Image Deployment

This module allows you to copy docker image assets to a repository you control.
This can be necessary if you want to build a Docker image in one CDK app and consume it in a different app or outside the CDK,
or if you want to apply a lifecycle policy to all images of a part of your application. 

### Getting Started

Below is a basic example for how to use the `DockerImageDeployment` API:

```ts
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as imagedeploy from 'cdk-docker-image-deployment';

const repo = ecr.Repository.fromRepositoryName(this, 'MyRepository', 'myrepository');

new imagedeploy.DockerImageDeployment(this, 'ExampleImageDeploymentWithTag', {
  source: imagedeploy.Source.directory('path/to/directory'),
  destination: imagedeploy.Destination.ecr(repo, { 
    tag: 'myspecialtag',
  }),
});
```

### Currently Supported Sources

- `Source.directory()`: Supply a path to a local docker image as source.

> Don't see a source listed? See if there is an open [issue](https://github.com/cdklabs/cdk-docker-image-deployment/issues)
> or [PR](https://github.com/cdklabs/cdk-docker-image-deployment/pulls) already. If not, please open an issue asking for it
> or better yet, submit a contribution!

### Currently Supported Destinations

- `Destination.ecr(repo, options)`: Send your docker image to an ECR repository in your stack's account.

> Don't see a destination listed? See if there is an open [issue](https://github.com/cdklabs/cdk-docker-image-deployment/issues)
> or [PR](https://github.com/cdklabs/cdk-docker-image-deployment/pulls) already. If not, please open an issue asking for it
> or better yet, submit a contribution!

### Under the Hood

1. When this stack is deployed (either via cdk deploy or via CI/CD), the contents of the local Docker image will be archived and uploaded to an intermediary assets ECR Repository using the cdk-assets mechanism.

2. The `DockerImageDeployment` construct synthesizes a CodeBuild Project which uses docker to pull the image from the intermediary repository, tag the image if a tag is provided, and push the image to the destination repository.

3. The deployment will wait until the CodeBuild Project completes successfully before finishing.

The architecture of this construct can be seen here:

![Construct-Architecture](https://user-images.githubusercontent.com/36202692/187282269-7ab29d3e-192f-470f-9123-5dbb62d9dac3.jpg)


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
<!-- Updated: Fri May 30 12:30:17 CEST 2025 -->
