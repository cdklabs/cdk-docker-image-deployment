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
  public static ecr(destinationProps: DestinationProps): Destination {
    return new Destination(destinationProps.repository, {
      destinationUri: destinationProps.repository.repositoryUri,
      destinationTag: destinationProps.tag,
    });
  };

  private constructor (public readonly repository: ecr.IRepository, public readonly config: DestinationConfig) {
  }
}
