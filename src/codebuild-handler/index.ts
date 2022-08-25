import * as AWSLambda from 'aws-lambda';
import * as AWS from 'aws-sdk';

const cb = new AWS.CodeBuild();

export async function onEventhandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return startBuild(event);
    case 'Delete':
      return onDelete();
  }
}

export async function startBuild(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const projectName = event.ResourceProperties.projectName;
  const buildOutput = await cb.startBuild({
    projectName: projectName,
  }).promise();

  const buildId = buildOutput.build?.id;

  if (buildId) {
    return {
      BuildId: buildId, // pass to isComplete
    };
  } else {
    throw new Error('BuildId does not exist after CodeBuild:StartBuild call');
  }
}

// pass isComplete a value to indicate it does not need to wait on delete events
export async function onDelete() {
  return {
    BuildId: 'onDelete',
  };
}

export async function isCompleteHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {

  const buildId = (event as any).BuildId; // BuildId is passed in from onEvent CodeBuild:StartBuild call

  if (!buildId) {
    throw new Error('BuildId was not found or undefined');
  }

  // isComplete does not need to wait on delete events
  if (buildId === 'onDelete') {
    return { IsComplete: true };
  }

  const build = await cb.batchGetBuilds({
    ids: [buildId],
  }).promise();

  // we should always have a build since we have a valid buildId
  if (!build.builds || build.builds.length <= 0) {
    throw new Error(`Build does not exist for BuildId: ${buildId}`);
  }

  const buildResponse = build.builds[0];
  const currentPhase = buildResponse.currentPhase;
  const buildStatus = buildResponse.buildStatus;

  if (currentPhase === 'COMPLETED' && buildStatus === 'SUCCEEDED') {
    return {
      IsComplete: true,
      Data: {
        Status: 'CodeBuild completed successfully',
        LogsUrl: `${JSON.stringify(buildResponse.logs?.deepLink)}`,
      },
    };
  } else if (currentPhase === 'COMPLETED' && buildStatus === 'FAILED') {
    if (buildResponse.logs?.deepLink) {
      throw new Error(`CodeBuild failed, check the logs here: ${buildResponse.logs.deepLink}`);
    } else {
      throw new Error('CodeBuild failed'); // this case should never be reached
    }
  } else {
    return { IsComplete: false }; // not finished
  }
}
