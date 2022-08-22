//import * as fs from 'fs';
//import * as path from 'path';
import { Fn } from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * Source information
 */
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
 * Bind context for Source
 */
export interface SourceContext {
  /**
   * The role for the handler
   */
  readonly handlerRole: iam.IRole;
}

/**
 * Specifies docker image deployment source
 *
 * Usage:
 *
 *  ```ts
 *  Source.directory('path/to/directory')
 *  ```
 *
 */
export abstract class Source {
  /**
   * Uses a local image built from a Dockerfile in a local directory as the source
   *
   * @param path
   */
  public static directory(path: string): Source {
    return new DirectorySource(path);
  }

  public static ecr(repository: ecr.IRepository, tag: string): Source {
    return new EcrSource(repository, tag);
  }

  public static asset(asset: ecr_assets.DockerImageAsset): Source { // | ecr_assets.TarballImageAsset): Source {
    return new AssetSource(asset);
  }
  public abstract bind(scope: Construct, context: SourceContext): SourceConfig;
}

/**
 * Source of docker image deployment is a local image from a directory
 */
class DirectorySource extends Source {
  private path: string;

  constructor(path: string) {
    super();
    this.path = path;
  }

  public bind(scope: Construct, context: SourceContext): SourceConfig {

    const asset = new ecr_assets.DockerImageAsset(scope, 'asset', {
      directory: this.path,
    });

    asset.repository.grantPull(context.handlerRole);

    return {
      imageUri: asset.imageUri,
      imageTag: Fn.select(1, Fn.split(':', asset.imageUri)),
      //imageTag: asset.imageTag
    };
  }
}

class EcrSource extends Source {
  private repository: ecr.IRepository;
  private tag: string;

  constructor(repository: ecr.IRepository, tag: string) {
    super();
    this.repository = repository;
    this.tag = tag;
  }

  public bind(_scope: Construct, context: SourceContext): SourceConfig {

    this.repository.grantPull(context.handlerRole);

    return {
      imageUri: this.repository.repositoryUriForTag(this.tag),
      imageTag: this.tag,
    };
  }
}

class AssetSource extends Source {
  private repository: ecr.IRepository;
  private tag: string;

  constructor(asset: ecr_assets.DockerImageAsset) {
    super();
    this.repository = asset.repository;
    this.tag = Fn.select(1, Fn.split(':', asset.imageUri));
  }

  public bind(_scope: Construct, context: SourceContext): SourceConfig {

    this.repository.grantPull(context.handlerRole);

    return {
      imageUri: this.repository.repositoryUriForTag(this.tag),
      imageTag: this.tag,
    };
  }
}
