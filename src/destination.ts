import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface DestinationConfig {
  /**
   * The URI of the destination repository to deploy to.
   */
  readonly destinationUri: string;

  /**
   * The tag of the deployed image.
   * Defaults to the tag of the source if not provided.
   */
  readonly destinationTag?: string;
}

/**
 * Specifies docker image deployment destination
 *
 * Usage:
 *
 *  Destination.ecr(repository, 'tag')
 *
 */
export abstract class Destination {
  /**
   * Uses an ECR repository as the destination for the image
   *
   * @param repository
   * @param tag
   */
  public static ecr(repository: ecr.IRepository, tag?: string): EcrDestination {
    return new EcrDestination(repository, tag);
  }

  public abstract readonly config: DestinationConfig;

  public abstract grantPermissions(role: iam.IGrantable): void;
}

/**
 * Destination of docker image deployment is an ECR repository
 */
class EcrDestination extends Destination {
  private repository: ecr.IRepository;
  public readonly config: DestinationConfig;

  constructor(repository: ecr.IRepository, tag?: string) {
    super();

    this.repository = repository;
    this.config = {
      destinationUri: repository.repositoryUri,
      destinationTag: tag,
    };
  }

  public grantPermissions(role: iam.IGrantable): void {
    this.repository.grantPullPush(role);
  }
}
