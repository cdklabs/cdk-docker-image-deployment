# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### DockerImageDeployment <a name="DockerImageDeployment" id="cdk-docker-image-deployment.DockerImageDeployment"></a>

`DockerImageDeployment` pushes an image from a local or external source to a specified external destination.

#### Initializers <a name="Initializers" id="cdk-docker-image-deployment.DockerImageDeployment.Initializer"></a>

```typescript
import { DockerImageDeployment } from 'cdk-docker-image-deployment'

new DockerImageDeployment(scope: Construct, id: string, props: DockerImageDeploymentProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.DockerImageDeployment.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-docker-image-deployment.DockerImageDeployment.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-docker-image-deployment.DockerImageDeployment.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-docker-image-deployment.DockerImageDeploymentProps">DockerImageDeploymentProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-docker-image-deployment.DockerImageDeployment.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-docker-image-deployment.DockerImageDeployment.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-docker-image-deployment.DockerImageDeployment.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-docker-image-deployment.DockerImageDeploymentProps">DockerImageDeploymentProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-docker-image-deployment.DockerImageDeployment.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-docker-image-deployment.DockerImageDeployment.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-docker-image-deployment.DockerImageDeployment.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-docker-image-deployment.DockerImageDeployment.isConstruct"></a>

```typescript
import { DockerImageDeployment } from 'cdk-docker-image-deployment'

DockerImageDeployment.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-docker-image-deployment.DockerImageDeployment.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.DockerImageDeployment.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-docker-image-deployment.DockerImageDeployment.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### DestinationConfig <a name="DestinationConfig" id="cdk-docker-image-deployment.DestinationConfig"></a>

Destination information.

#### Initializer <a name="Initializer" id="cdk-docker-image-deployment.DestinationConfig.Initializer"></a>

```typescript
import { DestinationConfig } from 'cdk-docker-image-deployment'

const destinationConfig: DestinationConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.DestinationConfig.property.destinationUri">destinationUri</a></code> | <code>string</code> | The URI of the destination repository to deploy to. |
| <code><a href="#cdk-docker-image-deployment.DestinationConfig.property.loginConfig">loginConfig</a></code> | <code><a href="#cdk-docker-image-deployment.LoginConfig">LoginConfig</a></code> | The login command and region. |
| <code><a href="#cdk-docker-image-deployment.DestinationConfig.property.destinationTag">destinationTag</a></code> | <code>string</code> | The tag of the deployed image. |

---

##### `destinationUri`<sup>Required</sup> <a name="destinationUri" id="cdk-docker-image-deployment.DestinationConfig.property.destinationUri"></a>

```typescript
public readonly destinationUri: string;
```

- *Type:* string

The URI of the destination repository to deploy to.

---

##### `loginConfig`<sup>Required</sup> <a name="loginConfig" id="cdk-docker-image-deployment.DestinationConfig.property.loginConfig"></a>

```typescript
public readonly loginConfig: LoginConfig;
```

- *Type:* <a href="#cdk-docker-image-deployment.LoginConfig">LoginConfig</a>

The login command and region.

---

##### `destinationTag`<sup>Optional</sup> <a name="destinationTag" id="cdk-docker-image-deployment.DestinationConfig.property.destinationTag"></a>

```typescript
public readonly destinationTag: string;
```

- *Type:* string
- *Default:* the tag of the source

The tag of the deployed image.

---

### DockerImageDeploymentProps <a name="DockerImageDeploymentProps" id="cdk-docker-image-deployment.DockerImageDeploymentProps"></a>

#### Initializer <a name="Initializer" id="cdk-docker-image-deployment.DockerImageDeploymentProps.Initializer"></a>

```typescript
import { DockerImageDeploymentProps } from 'cdk-docker-image-deployment'

const dockerImageDeploymentProps: DockerImageDeploymentProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.DockerImageDeploymentProps.property.destination">destination</a></code> | <code><a href="#cdk-docker-image-deployment.Destination">Destination</a></code> | Destination repository to deploy the image to. |
| <code><a href="#cdk-docker-image-deployment.DockerImageDeploymentProps.property.source">source</a></code> | <code><a href="#cdk-docker-image-deployment.Source">Source</a></code> | Source of the image to deploy. |

---

##### `destination`<sup>Required</sup> <a name="destination" id="cdk-docker-image-deployment.DockerImageDeploymentProps.property.destination"></a>

```typescript
public readonly destination: Destination;
```

- *Type:* <a href="#cdk-docker-image-deployment.Destination">Destination</a>

Destination repository to deploy the image to.

---

##### `source`<sup>Required</sup> <a name="source" id="cdk-docker-image-deployment.DockerImageDeploymentProps.property.source"></a>

```typescript
public readonly source: Source;
```

- *Type:* <a href="#cdk-docker-image-deployment.Source">Source</a>

Source of the image to deploy.

---

### EcrSourceOptions <a name="EcrSourceOptions" id="cdk-docker-image-deployment.EcrSourceOptions"></a>

Properties needed for Source.ecr.

#### Initializer <a name="Initializer" id="cdk-docker-image-deployment.EcrSourceOptions.Initializer"></a>

```typescript
import { EcrSourceOptions } from 'cdk-docker-image-deployment'

const ecrSourceOptions: EcrSourceOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.EcrSourceOptions.property.tag">tag</a></code> | <code>string</code> | Tag of deployed image. |

---

##### `tag`<sup>Optional</sup> <a name="tag" id="cdk-docker-image-deployment.EcrSourceOptions.property.tag"></a>

```typescript
public readonly tag: string;
```

- *Type:* string
- *Default:* tag of source

Tag of deployed image.

---

### LoginConfig <a name="LoginConfig" id="cdk-docker-image-deployment.LoginConfig"></a>

Login commands for specified registry.

#### Initializer <a name="Initializer" id="cdk-docker-image-deployment.LoginConfig.Initializer"></a>

```typescript
import { LoginConfig } from 'cdk-docker-image-deployment'

const loginConfig: LoginConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.LoginConfig.property.loginCommand">loginCommand</a></code> | <code>string</code> | Command to run in codebuild to login. |
| <code><a href="#cdk-docker-image-deployment.LoginConfig.property.region">region</a></code> | <code>string</code> | Region of ECR repository. |

---

##### `loginCommand`<sup>Required</sup> <a name="loginCommand" id="cdk-docker-image-deployment.LoginConfig.property.loginCommand"></a>

```typescript
public readonly loginCommand: string;
```

- *Type:* string

Command to run in codebuild to login.

Formatted `docker login ...`.

---

##### `region`<sup>Optional</sup> <a name="region" id="cdk-docker-image-deployment.LoginConfig.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string
- *Default:* undefined if not an ECR repository

Region of ECR repository.

---

### SourceConfig <a name="SourceConfig" id="cdk-docker-image-deployment.SourceConfig"></a>

Source information.

#### Initializer <a name="Initializer" id="cdk-docker-image-deployment.SourceConfig.Initializer"></a>

```typescript
import { SourceConfig } from 'cdk-docker-image-deployment'

const sourceConfig: SourceConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.SourceConfig.property.imageTag">imageTag</a></code> | <code>string</code> | The source tag. |
| <code><a href="#cdk-docker-image-deployment.SourceConfig.property.imageUri">imageUri</a></code> | <code>string</code> | The source image URI. |
| <code><a href="#cdk-docker-image-deployment.SourceConfig.property.loginConfig">loginConfig</a></code> | <code><a href="#cdk-docker-image-deployment.LoginConfig">LoginConfig</a></code> | The login command and region. |

---

##### `imageTag`<sup>Required</sup> <a name="imageTag" id="cdk-docker-image-deployment.SourceConfig.property.imageTag"></a>

```typescript
public readonly imageTag: string;
```

- *Type:* string

The source tag.

---

##### `imageUri`<sup>Required</sup> <a name="imageUri" id="cdk-docker-image-deployment.SourceConfig.property.imageUri"></a>

```typescript
public readonly imageUri: string;
```

- *Type:* string

The source image URI.

---

##### `loginConfig`<sup>Required</sup> <a name="loginConfig" id="cdk-docker-image-deployment.SourceConfig.property.loginConfig"></a>

```typescript
public readonly loginConfig: LoginConfig;
```

- *Type:* <a href="#cdk-docker-image-deployment.LoginConfig">LoginConfig</a>

The login command and region.

---

### SourceContext <a name="SourceContext" id="cdk-docker-image-deployment.SourceContext"></a>

Bind context for Source.

#### Initializer <a name="Initializer" id="cdk-docker-image-deployment.SourceContext.Initializer"></a>

```typescript
import { SourceContext } from 'cdk-docker-image-deployment'

const sourceContext: SourceContext = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.SourceContext.property.handlerRole">handlerRole</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | The role for the handler. |

---

##### `handlerRole`<sup>Required</sup> <a name="handlerRole" id="cdk-docker-image-deployment.SourceContext.property.handlerRole"></a>

```typescript
public readonly handlerRole: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

The role for the handler.

---

## Classes <a name="Classes" id="Classes"></a>

### Destination <a name="Destination" id="cdk-docker-image-deployment.Destination"></a>

Specifies docker image deployment destination.

Usage:

```ts
declare const repo: ecr.IRepository;
const destinationEcr = dockerDeploy.Destination.ecr(repository, {
  tag: 'tag',
});
```

#### Initializers <a name="Initializers" id="cdk-docker-image-deployment.Destination.Initializer"></a>

```typescript
import { Destination } from 'cdk-docker-image-deployment'

new Destination()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-docker-image-deployment.Destination.bind">bind</a></code> | Bind grants the CodeBuild role permissions to pull and push to a repository if necessary. |

---

##### `bind` <a name="bind" id="cdk-docker-image-deployment.Destination.bind"></a>

```typescript
public bind(role: IGrantable): DestinationConfig
```

Bind grants the CodeBuild role permissions to pull and push to a repository if necessary.

Bind should be invoked by the caller to get the DestinationConfig.

###### `role`<sup>Required</sup> <a name="role" id="cdk-docker-image-deployment.Destination.bind.parameter.role"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-docker-image-deployment.Destination.ecr">ecr</a></code> | Uses an ECR repository in the same account as the stack as the destination for the image. |

---

##### `ecr` <a name="ecr" id="cdk-docker-image-deployment.Destination.ecr"></a>

```typescript
import { Destination } from 'cdk-docker-image-deployment'

Destination.ecr(repository: IRepository, options?: EcrSourceOptions)
```

Uses an ECR repository in the same account as the stack as the destination for the image.

###### `repository`<sup>Required</sup> <a name="repository" id="cdk-docker-image-deployment.Destination.ecr.parameter.repository"></a>

- *Type:* aws-cdk-lib.aws_ecr.IRepository

---

###### `options`<sup>Optional</sup> <a name="options" id="cdk-docker-image-deployment.Destination.ecr.parameter.options"></a>

- *Type:* <a href="#cdk-docker-image-deployment.EcrSourceOptions">EcrSourceOptions</a>

---



### Source <a name="Source" id="cdk-docker-image-deployment.Source"></a>

Specifies docker image deployment source.

Usage:

```ts
import * as path from 'path';
const path = path.join(__dirname, 'path/to/directory');
const sourceDirectory = Source.directory(path);
```
or with additional `assetOptions`
```ts
import * as path from 'path';
const path = path.join(__dirname, 'path/to/directory');
const sourceDirectory = Source.directory(path, {
  file: 'Dockerfile.api',
  buildArgs: {
    HTTP_PROXY: 'http://10.20.30.2:1234'
  }
})
```

#### Initializers <a name="Initializers" id="cdk-docker-image-deployment.Source.Initializer"></a>

```typescript
import { Source } from 'cdk-docker-image-deployment'

new Source()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-docker-image-deployment.Source.bind">bind</a></code> | Bind grants the CodeBuild role permissions to pull from a repository if necessary. |

---

##### `bind` <a name="bind" id="cdk-docker-image-deployment.Source.bind"></a>

```typescript
public bind(scope: Construct, context: SourceContext): SourceConfig
```

Bind grants the CodeBuild role permissions to pull from a repository if necessary.

Bind should be invoked by the caller to get the SourceConfig.

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-docker-image-deployment.Source.bind.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `context`<sup>Required</sup> <a name="context" id="cdk-docker-image-deployment.Source.bind.parameter.context"></a>

- *Type:* <a href="#cdk-docker-image-deployment.SourceContext">SourceContext</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-docker-image-deployment.Source.directory">directory</a></code> | Uses a local image built from a Dockerfile in a local directory as the source. |

---

##### `directory` <a name="directory" id="cdk-docker-image-deployment.Source.directory"></a>

```typescript
import { Source } from 'cdk-docker-image-deployment'

Source.directory(path: string, assetOptions?: DockerImageAssetOptions)
```

Uses a local image built from a Dockerfile in a local directory as the source.

###### `path`<sup>Required</sup> <a name="path" id="cdk-docker-image-deployment.Source.directory.parameter.path"></a>

- *Type:* string

path to the directory containing your Dockerfile (not a path to a file).

---

###### `assetOptions`<sup>Optional</sup> <a name="assetOptions" id="cdk-docker-image-deployment.Source.directory.parameter.assetOptions"></a>

- *Type:* aws-cdk-lib.aws_ecr_assets.DockerImageAssetOptions

specify any additional [DockerImageAssetOptions](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecr_assets.DockerImageAssetOptions.html) (except `path`).

---




