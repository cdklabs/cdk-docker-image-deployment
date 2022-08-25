import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Destination information
 */
export interface DestinationConfig {
  /**
   * The URI of the destination repository to deploy to.
   */
  readonly destinationUri: string;

  /**
   * The tag of the deployed image.
   * @default - the tag of the source
   */
  readonly destinationTag?: string;
}

/**
 * Properties needed for Source.ecr
 */
export interface EcrSourceOptions {
  /**
   * Tag of deployed image
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
   * Uses an ECR repository as the destination for the image
   */
  public static ecr(repository: ecr.IRepository, options?: EcrSourceOptions): Destination {
    return new EcrDestination(repository, options);
  }

  public abstract readonly config: DestinationConfig;

  /**
   * bind grants the CodeBuild role permissions to pull and push to a repository if necessary
   * bind should be invoked by the caller to get the DestinationConfig
   */
  public abstract bind(role: iam.IGrantable): void;
}

/**
 * Class used when the destination of docker image deployment is an ECR repository
 */
class EcrDestination extends Destination {
  private repository: ecr.IRepository;
  public readonly config: DestinationConfig;

  constructor(repository: ecr.IRepository, options?: EcrSourceOptions) {
    super();

    this.repository = repository;

    this.config = {
      destinationUri: repository.repositoryUri,
      destinationTag: options?.tag,
    };
  }

  public bind(role: iam.IGrantable): void {
    this.repository.grantPullPush(role);
  }
}
