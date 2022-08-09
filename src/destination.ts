import * as ecr from 'aws-cdk-lib/aws-ecr';

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

export interface DestinationProps {
  /**
    * The destination repository to deploy to.
    */
  readonly repository: ecr.IRepository;

  /**
    * The tag of the deployed image.
    * Defaults to the tag of the source if not provided.
    */
  readonly tag?: string;
}

export class Destination {
  public static ecr(repository: ecr.IRepository, tag?: string): Destination {
    return new Destination(repository, {
      destinationUri: repository.repositoryUri,
      destinationTag: tag,
    });
  };

  private constructor (public readonly repository: ecr.IRepository, public readonly config: DestinationConfig) {
  }
}
