import * as AWSLambda from 'aws-lambda';
import * as AWS from 'aws-sdk';

const cb = new AWS.CodeBuild();

export async function onEventhandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return startBuild(event);
    case 'Delete':
      return;
  }
}

export async function startBuild(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const projectName = event.ResourceProperties.projectName;
  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    await cb.startBuild({
      projectName: projectName,
    }).promise();
  }
}

export async function isCompleteHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const projectName = event.ResourceProperties.projectName;
  const buildIds = await cb.listBuildsForProject({
    projectName: projectName,
    sortOrder: 'DESCENDING',
  }).promise();

  // there should always be a buildId since this function runs after onEventHandler starts the build
  if (buildIds.ids) {
    const buildId = buildIds.ids.slice(0, 1); // most recent build from the project stared by onEventHandler

    const build = await cb.batchGetBuilds({
      ids: buildId,
    }).promise();

    // we should always have a build since we have a valid buildId
    if (build.builds && build.builds.length > 0) {
      const currentPhase = build.builds[0].currentPhase;
      const buildStatus = build.builds[0].buildStatus;

      if (currentPhase === 'COMPLETED' && buildStatus === 'SUCCEEDED') {
        return {
          IsComplete: true,
          Data: { status: 'succeeded' },
        };
      } else if (currentPhase === 'COMPLETED' && buildStatus === 'FAILED') {
        return {
          IsComplete: true,
          Data: { status: 'failed' },
        };
      } else {
        // not finished
        return { IsComplete: false };
      }
    } else {
      return {
        IsComplete: true,
        Data: 'builds undefined',
      };
    }
  } else {
    return {
      IsComplete: false,
      Data: 'buildId undefined',
    };
  }
}
