import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface SourceConfig {
  /**
   * The source image URI.
   */
  readonly imageUri: string;

  /**
   * The source tag.
   */
  readonly imageTag: string;
}

/**
 * Bind context for ISources
 */
export interface SourceContext {
  /**
   * The role for the handler
   */
  readonly handlerRole: iam.IRole;
}

export abstract class Source {
  public static directory(path: string): DirectorySource {
    return new DirectorySource(path);
  }

  public abstract bind(scope: Construct, context?: SourceContext): SourceConfig;
}

export class DirectorySource extends Source {
  private path: string;

  constructor(path: string) {
    super();
    this.path = path;
  }

  public bind(scope: Construct, context?: SourceContext): SourceConfig {
    if (!context) {
      throw new Error('To use a Source.directory(), context must be provided');
    }

    let id = 1;
    while (scope.node.tryFindChild(`Assets${id}`)) {
      id += 1;
    }

    const asset = new ecr_assets.DockerImageAsset(scope, `Asset${id}`, {
      directory: this.path,
    });

    // validation for directory vs file

    asset.repository.grantPull(context.handlerRole);

    return {
      imageUri: asset.imageUri,
      imageTag: asset.assetHash,
    };
  }
}
