// imports
import * as path from 'path';
//import { Match, Template } from 'aws-cdk-lib/assertions';
import { Match, Template } from 'aws-cdk-lib/assertions';
//import * as cxapi from 'aws-cdk-lib/cx-api';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib/core';
import * as imagedeploy from '../src';

describe('DockerImageDeploy', () => {
  describe('Source: directory', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const testSource = imagedeploy.Source.directory(path.join(__dirname, 'assets'));

    describe('Destination: ecr', () => {
      // GIVEN
      const repo = new ecr.Repository(stack, 'TestRepository');
      const testDesination = imagedeploy.Destination.ecr(repo, 'tag');

      // WHEN
      new imagedeploy.DockerImageDeployment(stack, 'TestDeployment', {
        source: testSource,
        destination: testDesination,
      });

      test('iam policy is granted correct permissions', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: Match.arrayWith([
              {
                Action: [
                  'ecr:BatchCheckLayerAvailability',
                  'ecr:GetDownloadUrlForLayer',
                  'ecr:BatchGetImage',
                ],
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': [
                    'TestRepositoryC0DA8195',
                    'Arn',
                  ],
                },
              },
              {
                Action: [
                  'ecr:PutImage',
                  'ecr:InitiateLayerUpload',
                  'ecr:UploadLayerPart',
                  'ecr:CompleteLayerUpload',
                ],
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': [
                    'TestRepositoryC0DA8195',
                    'Arn',
                  ],
                },
              },
            ]),
          },
        });
      });

      /*
      test('codebuild has correct buildspec', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
          Source: {
            BuildSpec: {
              "Fn::Join": [
                "",
                [
                  "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"pre_build\": {\n      \"commands\": [\n        \"aws ecr get-login-password --region ",
                  {
                    "Ref": "AWS::Region"
                  },
                  " | docker login --username AWS --password-stdin ",
                  {
                    "Ref": "AWS::AccountId"
                  },
                  ".dkr.ecr.",
                  {
                    "Ref": "AWS::Region"
                  },
                  ".amazonaws.com\"\n      ]\n    },\n    \"build\": {\n      \"commands\": [\n        \"docker pull ",
                  {
                    "Fn::Sub": "${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:"
                  },
                  "\",\n        \"docker tag ",
                  {
                    "Fn::Sub": "${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:47b6b32153304b5f10190be5925cb26a165587acd28130f4f698ea9aea90d858"
                  },
                  " ",
                  {
                    "Fn::Select": [
                      4,
                      {
                        "Fn::Split": [
                          ":",
                          {
                            "Fn::GetAtt": [
                              "mydockerimagedeploytestrepo016DCC80",
                              "Arn"
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  ".dkr.ecr.",
                  {
                    "Fn::Select": [
                      3,
                      {
                        "Fn::Split": [
                          ":",
                          {
                            "Fn::GetAtt": [
                              "mydockerimagedeploytestrepo016DCC80",
                              "Arn"
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  ".",
                  {
                    "Ref": "AWS::URLSuffix"
                  },
                  "/",
                  {
                    "Ref": "mydockerimagedeploytestrepo016DCC80"
                  },
                  ":newtag2\"\n      ]\n    },\n    \"post_build\": {\n      \"commands\": [\n        \"docker push ",
                  {
                    "Fn::Select": [
                      4,
                      {
                        "Fn::Split": [
                          ":",
                          {
                            "Fn::GetAtt": [
                              "mydockerimagedeploytestrepo016DCC80",
                              "Arn"
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  ".dkr.ecr.",
                  {
                    "Fn::Select": [
                      3,
                      {
                        "Fn::Split": [
                          ":",
                          {
                            "Fn::GetAtt": [
                              "mydockerimagedeploytestrepo016DCC80",
                              "Arn"
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  ".",
                  {
                    "Ref": "AWS::URLSuffix"
                  },
                  "/",
                  {
                    "Ref": "mydockerimagedeploytestrepo016DCC80"
                  },
                  ":newtag2\"\n      ]\n    }\n  }\n}"
                ]
              ]
            },
            Type: "NO_SOURCE"
          },
        });
      });
      */

    });
  });
});