import * as AWSLambda from 'aws-lambda';
import * as AWS from 'aws-sdk';
//import * as cr from 'aws-cdk-lib/custom-resources';
//import * as codebuild from 'aws-codebuild';


const cb = new AWS.CodeBuild();

export async function onEventhandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  console.log('in handler function');
  console.log(`event.RequestType: ${event.RequestType}`);
  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      console.log(`case: ${event.RequestType}`);
      return startBuild(event);
    case 'Delete':
      console.log('delete case');
      return;
  }
}

export async function startBuild(event: AWSLambda.CloudFormationCustomResourceEvent) {
  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    console.log('in startBuild function');
    console.log(`see what this variable is event.ResourceProperties.projectName: ${event.ResourceProperties.projectName}`);
    await cb.startBuild({
      projectName: event.ResourceProperties.projectName,
    }, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(data); // successful response);
      }
    //const projectName = event.ResourceProperties['projectName'];
    }).promise();
    //console.log('after startBuild');
    //console.log(`result: ${result}`);
  }
}

export async function isCompleteHandler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  //const physicalId = event.LogicalResourceId;
  //const requestType = event.RequestType;
  const projectName = event.ResourceProperties.projectName;
  const buildIds = await cb.listBuildsForProject({
    projectName: projectName,
    sortOrder: 'DESCENDING',
  }).promise();

  console.log(`buildIds: ${buildIds}`);

  if (buildIds.ids !== undefined) {
    const buildId = buildIds.ids.slice(0, 1);

    console.log(`buildId: ${buildId}`);

    const build = await cb.batchGetBuilds({
      ids: buildId,
    }).promise();

    console.log(`build: ${build}`);

    if (build.builds !== undefined) {
      const currentPhase = build.builds[0].currentPhase;
      const buildStatus = build.builds[0].buildStatus;

      console.log(`currentPhase: ${currentPhase}`);
      console.log(`buildStatus: ${buildStatus}`);

      if (currentPhase === 'COMPLETED' && buildStatus === 'SUCCEEDED') {
        // do good thing
        console.log('good thing');
        return {
          IsComplete: true,
          Data: '{ "test": "here" }',
        };
      } else {
        // do bad thing
        console.log('bad thing');
        return { IsComplete: false };
      }
    } else {
      console.log('builds undefined');
      return { IsComplete: false };
    }
  } else {
    console.log('buildId undefined');
    return { IsComplete: false };
  }


}

