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

  protected validateTag(tag: string): void {
    if (tag.length > 128) {
      throw new Error (`Invalid tag: tags may contain a maximum of 128 characters; your tag ${tag} has ${tag.length} characters`);
    }
    if (!/^[^-.][a-zA-Z0-9-_.]+$/.test(tag)) {
      throw new Error(`Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'; your tag was ${tag}`);
    }
  }

  /**
   * bind grants the CodeBuild role permissions to pull and push to a repository if necessary
   * bind should be invoked by the caller to get the DesitinationConfig
   */
  public abstract bind(role: iam.IGrantable): void;
}

/**
 * Destination of docker image deployment is an ECR repository
 */
class EcrDestination extends Destination {
  private repository: ecr.IRepository;
  public readonly config: DestinationConfig;

  constructor(repository: ecr.IRepository, options?: EcrSourceOptions) {
    super();

    this.repository = repository;

    if (options?.tag !== undefined) {
      super.validateTag(options.tag);
    }

    this.config = {
      destinationUri: repository.repositoryUri,
      destinationTag: options?.tag,
    };
  }

  public bind(role: iam.IGrantable): void {
    this.repository.grantPullPush(role);
  }
}
