import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { LoginConfig } from './login';

/**
 * Destination information
 */
export interface DestinationConfig {
  /**
   * The URI of the destination repository to deploy to.
   */
  readonly destinationUri: string;

  /**
   * The login command and region.
   */
  readonly loginConfig: LoginConfig;

  /**
   * The tag of the deployed image.
   *
   * @default - the tag of the source
   */
  readonly destinationTag?: string;
}

/**
 * Properties needed for Source.ecr
 */
export interface EcrSourceOptions {
  /**
   * Tag of deployed image.
   *
   * @default -  tag of source
   */
  readonly tag?: string;
}

/**
 * Specifies docker image deployment destination
 *
 * Usage:
 *
 * ```ts
 * declare const repo: ecr.IRepository;
 * const destinationEcr = dockerDeploy.Destination.ecr(repository, {
 *   tag: 'tag',
 * });
 * ```
 *
 */
export abstract class Destination {
  /**
   * Uses an ECR repository in the same account as the stack as the destination for the image.
   */
  public static ecr(repository: ecr.IRepository, options?: EcrSourceOptions): Destination {
    return new EcrDestination(repository, options);
  }

  /**
   * Bind grants the CodeBuild role permissions to pull and push to a repository if necessary.
   * Bind should be invoked by the caller to get the DestinationConfig.
   */
  public abstract bind(role: iam.IGrantable): DestinationConfig;
}

/**
 * Class used when the destination of docker image deployment is an ECR repository in the same account as the stack
 */
class EcrDestination extends Destination {
  private repository: ecr.IRepository;
  private options?: EcrSourceOptions;

  constructor(repository: ecr.IRepository, options?: EcrSourceOptions) {
    super();

    this.repository = repository;
    this.options = options;

  }

  public bind(role: iam.IGrantable): DestinationConfig {
    const accountId = this.repository.env.account;
    const region = this.repository.env.region;

    this.repository.grantPullPush(role);

    return {
      destinationUri: this.repository.repositoryUri,
      loginConfig: {
        loginCommand: `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
        region: region,
      },
      destinationTag: this.options?.tag,
    };
  }
}
