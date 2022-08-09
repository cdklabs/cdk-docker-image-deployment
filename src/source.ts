//import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';


export interface SourceConfig {
  /**
   * The source imageUri.
   */
  readonly imageUri: string;

  /**
   * The source tag.
   */
  readonly imageTag: string;
}

// is this needed?
/**
 * Bind context for ISources
 */
export interface SourceContext {
  /**
   * The role for the handler
   */
  readonly handlerRole: iam.IRole;
}

// needs to be called ISource since 'Interface contains behavior'
//export interface ISource {
  /**
   * Binds the source to a docker image deployment.
   * @param scope The construct tree context.
   */
  //bind(scope: Construct, context?: DeploymentSourceContext): SourceConfig;
//}

export abstract class Source {
  public imageUri: string;
  public imageTag: string;
  
  public abstract bind(scope: Construct, context?: SourceContext): void;
  
  public static directory(path: string): DirectorySource {
    return new DirectorySource(path);
  }

  protected constructor() {}
}

export class DirectorySource extends Source{
  private path: string
  
  constructor(path: string) {
    super();
    this.path = path;
  }

  public bind(scope: Construct, context?: SourceContext): void {
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

    this.imageUri = asset.imageUri;
    this.imageTag = asset.assetHash;
  }
}

/*
export class Source {
  public static directory(path: string): ISource { // TODO: add build props
    return {
      bind(scope: Construct, context?: DeploymentSourceContext): SourceConfig {
        if (!context) {
          throw new Error('To use a Source.directory(), context must be provided');
        }

        let id = 1;
        while (scope.node.tryFindChild(`Assets${id}`)) {
          id += 1;
        }

        const asset = new ecr_assets.DockerImageAsset(scope, `Asset${id}`, {
          directory: path,
        });

        // does there need to be a validation check here? I dont think so since it will fail at synth time if image is not found at path

        return {
          imageUri: asset.imageUri,
          imageTag: asset.assetHash,
        };
      },
    };
  }
*/
  // TODO: add more sources
  /*
  // untested
  public static asset(asset: ecr_assets.DockerImageAsset): ISource {
    return {
      bind(_: Construct, context?: DeploymentSourceContext): SourceConfig {
        if (!context) {
          throw new Error('To use a Source.asset(), context must be provided');
        }

        return {
          login: { sourceLocation: sourceLocations.ECR},
          imageUri: asset.imageUri
        };
      },
    };
  }

  // untested
  public static ecr(repository: ecr.IRepository, tag: string): ISource {
    return {
      bind(_: Construct, context?: DeploymentSourceContext): SourceConfig {
        if (!context) {
          throw new Error('To use a Source.ecr(), context must be provided');
        }

        return {
          login: { sourceLocation: sourceLocations.ECR, ecrRegion: repository.env.region ,ecrAccount: repository.env.account},
          imageUri: repository.repositoryUriForTag(tag)
        };
      },
    };
  }

  // this will need to do a completely different operation than directory, asset, and ecr
  // needs to download tar/zip file
  // load with docker load
  // tag using name (might not be hard)
  // then push

  public s3(bucket: s3.IBucket, zipObjectKey: string): ISource {

  }
  

  private constructor () {}
}
*/