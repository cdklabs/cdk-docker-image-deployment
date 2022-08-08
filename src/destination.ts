import * as ecr from 'aws-cdk-lib/aws-ecr';
//import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
//import * as iam from 'aws-cdk-lib/aws-iam';
//import { Construct } from 'constructs';


export interface DestinationConfig {
  /**
   * The URI of the destination repository to deploy to.
   */
  readonly destinationURI: string;

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
  public static ecr(destinationProps: DestinationProps): DestinationConfig {
    return {
      destinationURI: destinationProps.repository.repositoryUri,
      destinationTag: destinationProps.tag,
    };
  };

  private constructor () {}
}