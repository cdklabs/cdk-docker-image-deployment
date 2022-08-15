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
| <code><a href="#cdk-docker-image-deployment.DestinationConfig.property.destinationTag">destinationTag</a></code> | <code>string</code> | The tag of the deployed image. |

---

##### `destinationUri`<sup>Required</sup> <a name="destinationUri" id="cdk-docker-image-deployment.DestinationConfig.property.destinationUri"></a>

```typescript
public readonly destinationUri: string;
```

- *Type:* string

The URI of the destination repository to deploy to.

---

##### `destinationTag`<sup>Optional</sup> <a name="destinationTag" id="cdk-docker-image-deployment.DestinationConfig.property.destinationTag"></a>

```typescript
public readonly destinationTag: string;
```

- *Type:* string

The tag of the deployed image.

Defaults to the tag of the source if not provided.

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

### EcrOptions <a name="EcrOptions" id="cdk-docker-image-deployment.EcrOptions"></a>

Properties needed for Source.ecr.

#### Initializer <a name="Initializer" id="cdk-docker-image-deployment.EcrOptions.Initializer"></a>

```typescript
import { EcrOptions } from 'cdk-docker-image-deployment'

const ecrOptions: EcrOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.EcrOptions.property.tag">tag</a></code> | <code>string</code> | Tag of deployed image Defaults to tag of source. |

---

##### `tag`<sup>Optional</sup> <a name="tag" id="cdk-docker-image-deployment.EcrOptions.property.tag"></a>

```typescript
public readonly tag: string;
```

- *Type:* string

Tag of deployed image Defaults to tag of source.

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
  Destination.ecr(repository, 'tag')
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
| <code><a href="#cdk-docker-image-deployment.Destination.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-docker-image-deployment.Destination.bind"></a>

```typescript
public bind(role: IGrantable): void
```

###### `role`<sup>Required</sup> <a name="role" id="cdk-docker-image-deployment.Destination.bind.parameter.role"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-docker-image-deployment.Destination.ecr">ecr</a></code> | Uses an ECR repository as the destination for the image. |

---

##### `ecr` <a name="ecr" id="cdk-docker-image-deployment.Destination.ecr"></a>

```typescript
import { Destination } from 'cdk-docker-image-deployment'

Destination.ecr(repository: IRepository, options?: EcrOptions)
```

Uses an ECR repository as the destination for the image.

###### `repository`<sup>Required</sup> <a name="repository" id="cdk-docker-image-deployment.Destination.ecr.parameter.repository"></a>

- *Type:* aws-cdk-lib.aws_ecr.IRepository

---

###### `options`<sup>Optional</sup> <a name="options" id="cdk-docker-image-deployment.Destination.ecr.parameter.options"></a>

- *Type:* <a href="#cdk-docker-image-deployment.EcrOptions">EcrOptions</a>

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-docker-image-deployment.Destination.property.config">config</a></code> | <code><a href="#cdk-docker-image-deployment.DestinationConfig">DestinationConfig</a></code> | *No description.* |

---

##### `config`<sup>Required</sup> <a name="config" id="cdk-docker-image-deployment.Destination.property.config"></a>

```typescript
public readonly config: DestinationConfig;
```

- *Type:* <a href="#cdk-docker-image-deployment.DestinationConfig">DestinationConfig</a>

---


### Source <a name="Source" id="cdk-docker-image-deployment.Source"></a>

Specifies docker image deployment source.

Usage:

  ```ts
  Source.directory('path/to/directory')
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
| <code><a href="#cdk-docker-image-deployment.Source.bind">bind</a></code> | *No description.* |

---

##### `bind` <a name="bind" id="cdk-docker-image-deployment.Source.bind"></a>

```typescript
public bind(scope: Construct, context: SourceContext): SourceConfig
```

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

Source.directory(path: string)
```

Uses a local image built from a Dockerfile in a local directory as the source.

###### `path`<sup>Required</sup> <a name="path" id="cdk-docker-image-deployment.Source.directory.parameter.path"></a>

- *Type:* string

---




