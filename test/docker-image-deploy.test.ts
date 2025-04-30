// imports
import * as path from 'path';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib/core';
import * as imagedeploy from '../lib/index';

describe('DockerImageDeploy', () => {
  describe('Source: directory', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const testSource = imagedeploy.Source.directory(path.join(__dirname, 'assets/test1'));

    describe('Destination: ecr', () => {
      // GIVEN
      const repo = new ecr.Repository(stack, 'TestRepository');
      const testDesination = imagedeploy.Destination.ecr(repo, { tag: 'testtag' });
      const testDesinationNoTag = imagedeploy.Destination.ecr(repo, {});
      const testDesinationNoOptions = imagedeploy.Destination.ecr(repo);

      // WHEN
      new imagedeploy.DockerImageDeployment(stack, 'TestDeployment', {
        source: testSource,
        destination: testDesination,
      });

      new imagedeploy.DockerImageDeployment(stack, 'TestDeploymentNoTag', {
        source: testSource,
        destination: testDesinationNoTag,
      });

      new imagedeploy.DockerImageDeployment(stack, 'TestDeploymentNoOptions', {
        source: testSource,
        destination: testDesinationNoOptions,
      });

      new imagedeploy.DockerImageDeployment(stack, 'TestDeploymentWithLogGroup', {
        source: testSource,
        destination: testDesination,
        crProviderLogGroup: new logs.LogGroup(stack, 'CrProviderLogGroup', { retention: logs.RetentionDays.ONE_DAY }),
        onEventHandlerLogGroup: new logs.LogGroup(stack, 'OnEventLogGroup', { retention: logs.RetentionDays.FIVE_DAYS }),
        isCompleteHandlerLogGroup: new logs.LogGroup(stack, 'IsCompleteLogGroup', { retention: logs.RetentionDays.ONE_WEEK }),
        crWaiterStateMachineLogOptions: { destination: new logs.LogGroup(stack, 'WaiterSfnLogGroup', { retention: logs.RetentionDays.ONE_MONTH }) },
      } );

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
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':ecr:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':repository/',
                      {
                        'Fn::Sub': 'cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}',
                      },
                    ],
                  ],
                },
              },
              {
                Action: 'ecr:GetAuthorizationToken',
                Effect: 'Allow',
                Resource: '*',
              },
              {
                Action: [
                  'ecr:BatchCheckLayerAvailability',
                  'ecr:GetDownloadUrlForLayer',
                  'ecr:BatchGetImage',
                  'ecr:CompleteLayerUpload',
                  'ecr:UploadLayerPart',
                  'ecr:InitiateLayerUpload',
                  'ecr:PutImage',
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
                  'logs:CreateLogGroup',
                  'logs:CreateLogStream',
                  'logs:PutLogEvents',
                ],
                Effect: 'Allow',
                Resource: [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':logs:',
                        {
                          Ref: 'AWS::Region',
                        },
                        ':',
                        {
                          Ref: 'AWS::AccountId',
                        },
                        ':log-group:/aws/codebuild/',
                        {
                          Ref: 'TestDeploymentDockerImageDeployProject0884B3B5',
                        },
                      ],
                    ],
                  },
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':logs:',
                        {
                          Ref: 'AWS::Region',
                        },
                        ':',
                        {
                          Ref: 'AWS::AccountId',
                        },
                        ':log-group:/aws/codebuild/',
                        {
                          Ref: 'TestDeploymentDockerImageDeployProject0884B3B5',
                        },
                        ':*',
                      ],
                    ],
                  },
                ],
              },
              {
                Action: [
                  'codebuild:CreateReportGroup',
                  'codebuild:CreateReport',
                  'codebuild:UpdateReport',
                  'codebuild:BatchPutTestCases',
                  'codebuild:BatchPutCodeCoverages',
                ],
                Effect: 'Allow',
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':codebuild:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':report-group/',
                      {
                        Ref: 'TestDeploymentDockerImageDeployProject0884B3B5',
                      },
                      '-*',
                    ],
                  ],
                },
              },
            ]),
          },
        });
      });

      test('docker tag command is well formatted: tag provided', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
          Source: {
            BuildSpec: {
              'Fn::Join': Match.arrayWith([
                Match.arrayWith([
                  '",\n        "docker tag ',
                  { 'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:70d1a3115d17d2ad7210b272e45b7398a7661e7b0cf24b52e059ae3f1fa8f2c1' },
                  ' ',
                  {
                    'Fn::Select': [4, {
                      'Fn::Split': [':', {
                        'Fn::GetAtt': [
                          'TestRepositoryC0DA8195',
                          'Arn',
                        ],
                      }],
                    }],
                  },
                  '.dkr.ecr.',
                  {
                    'Fn::Select': [3, {
                      'Fn::Split': [':', {
                        'Fn::GetAtt': [
                          'TestRepositoryC0DA8195',
                          'Arn',
                        ],
                      }],
                    }],
                  },
                  '.',
                  { Ref: 'AWS::URLSuffix' },
                  '/',
                  { Ref: 'TestRepositoryC0DA8195' },
                  Match.stringLikeRegexp('^:testtag",(.)*'),
                ]),
              ]),
            },
          },
        });
      });

      test('docker tag command is well formatted: no tag provided', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
          Source: {
            BuildSpec: {
              'Fn::Join': Match.arrayWith([
                Match.arrayWith([
                  '",\n        "docker tag ',
                  { 'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:70d1a3115d17d2ad7210b272e45b7398a7661e7b0cf24b52e059ae3f1fa8f2c1' },
                  ' ',
                  {
                    'Fn::Select': [4, {
                      'Fn::Split': [':', {
                        'Fn::GetAtt': [
                          'TestRepositoryC0DA8195',
                          'Arn',
                        ],
                      }],
                    }],
                  },
                  '.dkr.ecr.',
                  {
                    'Fn::Select': [3, {
                      'Fn::Split': [':', {
                        'Fn::GetAtt': [
                          'TestRepositoryC0DA8195',
                          'Arn',
                        ],
                      }],
                    }],
                  },
                  '.',
                  { Ref: 'AWS::URLSuffix' },
                  '/',
                  { Ref: 'TestRepositoryC0DA8195' },
                  // need no-tag validation here, will be better once cdk 2.38.1 is recognized
                ]),
              ]),
            },
          },
        });
      });

    });

    test('ECR login and pull commands are well formatted', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
          BuildSpec: {
            'Fn::Join': Match.arrayWith([
              Match.arrayWith([
                /*
                '{\n  "version": "0.2",\n  "phases": {\n    "pre_build": {\n      "commands": [\n        "aws ecr get-login-password --region ',
                { Ref: 'AWS::Region' },
                ' | docker login --username AWS --password-stdin ',
                { Ref: 'AWS::AccountId' },
                '.dkr.ecr.',
                { Ref: 'AWS::Region' },
                '.amazonaws.com"\n      ]\n    },\n    "build": {\n      "commands": [\n        "docker pull ',
                { 'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:70d1a3115d17d2ad7210b272e45b7398a7661e7b0cf24b52e059ae3f1fa8f2c1' },
                */
                '{\n  "version": "0.2",\n  "phases": {\n    "build": {\n      "commands": [\n        "aws ecr get-login-password --region ',
                { Ref: 'AWS::Region' },
                ' | docker login --username AWS --password-stdin ',
                { Ref: 'AWS::AccountId' },
                '.dkr.ecr.',
                { Ref: 'AWS::Region' },
                '.amazonaws.com",\n        "docker pull ',
                { 'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:70d1a3115d17d2ad7210b272e45b7398a7661e7b0cf24b52e059ae3f1fa8f2c1' },
                '",\n        "docker tag ',
                { 'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:70d1a3115d17d2ad7210b272e45b7398a7661e7b0cf24b52e059ae3f1fa8f2c1' },
                ' ',
                { 'Fn::Select': [4, { 'Fn::Split': [':', { 'Fn::GetAtt': ['TestRepositoryC0DA8195', 'Arn'] }] }] },
                '.dkr.ecr.',
                { 'Fn::Select': [3, { 'Fn::Split': [':', { 'Fn::GetAtt': ['TestRepositoryC0DA8195', 'Arn'] }] }] },
                '.',
                { Ref: 'AWS::URLSuffix' },
                '/',
                { Ref: 'TestRepositoryC0DA8195' },
                ':testtag",\n        "docker push ',
                { 'Fn::Select': [4, { 'Fn::Split': [':', { 'Fn::GetAtt': ['TestRepositoryC0DA8195', 'Arn'] }] }] },
                '.dkr.ecr.',
                { 'Fn::Select': [3, { 'Fn::Split': [':', { 'Fn::GetAtt': ['TestRepositoryC0DA8195', 'Arn'] }] }] },
                '.',
                { Ref: 'AWS::URLSuffix' },
                '/',
                { Ref: 'TestRepositoryC0DA8195' },
                ':testtag",\n        "docker logout"\n      ]\n    }\n  }\n}',
              ]),
            ]),
          },
        },
      });
    });

    describe('Custom Resrouces', () => {
      test('onEventHandler has correct permissions', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: Match.arrayWith([
              {
                Action: 'codebuild:StartBuild',
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': [
                    'TestDeploymentDockerImageDeployProject0884B3B5',
                    'Arn',
                  ],
                },
              },
            ]),
          },
        });
      });

      test('isCompleteHandler has correct permissions', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: Match.arrayWith([
              {
                Action: [
                  'codebuild:ListBuildsForProject',
                  'codebuild:BatchGetBuilds',
                ],
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': [
                    'TestDeploymentDockerImageDeployProject0884B3B5',
                    'Arn',
                  ],
                },
              },
            ]),
          },
        });
      });

      test('deploy with onEventhandler log group', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
          Handler: 'index.onEventhandler',
          LoggingConfig: {
            LogGroup: {
              Ref: 'OnEventLogGroup5AB79325',
            },
          },
        });
      });

      test('deploy with onEventhandler log group', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
          Handler: 'index.isCompleteHandler',
          LoggingConfig: {
            LogGroup: {
              Ref: 'IsCompleteLogGroupE01E0185',
            },
          },
        });
      });

      test('deploy with CRProvider log group', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
          LoggingConfig: {
            LogGroup: {
              Ref: 'CrProviderLogGroup33080E63',
            },
          },
        });
      });

      test('deploy with WaiterStateMachine log options', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
          LoggingConfiguration: {
            Destinations: [
              {
                CloudWatchLogsLogGroup: {
                  LogGroupArn: {
                    'Fn::GetAtt': [
                      'TestDeploymentCRProviderwaiterstatemachineLogGroupC06C22F6',
                      'Arn',
                    ],
                  },
                },
              },
            ],
            IncludeExecutionData: false,
            Level: 'ERROR',
          },
        });
      });
    });
  });

  describe('Tag validation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'TestTagsRepository');
    const testSource = imagedeploy.Source.directory(path.join(__dirname, 'assets/test1'));

    test('valid tag', () => {
      new imagedeploy.DockerImageDeployment(stack, 'TestValidTag', {
        source: testSource,
        destination: imagedeploy.Destination.ecr(repo, { tag: '_test_TEST-1234.tag-' }),
      });
    });

    test('options not provided does not throw', () => {
      new imagedeploy.DockerImageDeployment(stack, 'TestNoOptions', {
        source: testSource,
        destination: imagedeploy.Destination.ecr(repo),
      });
    });

    test('tag not provided does not throw', () => {
      new imagedeploy.DockerImageDeployment(stack, 'TestNoTag', {
        source: testSource,
        destination: imagedeploy.Destination.ecr(repo, {}),
      });
    });

    test('empyty tag', () => {
      expect(() => {
        new imagedeploy.DockerImageDeployment(stack, 'TestEmptyTag', {
          source: testSource,
          destination: imagedeploy.Destination.ecr(repo, { tag: '' }),
        });
      }).toThrow('Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'');
    });

    test('tag contains invalid character', () => {
      expect(() => {
        new imagedeploy.DockerImageDeployment(stack, 'TestInvalidCharacter', {
          source: testSource,
          destination: imagedeploy.Destination.ecr(repo, { tag: 'testTag123!' }),
        });
      }).toThrow('Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'');
    });

    test('tag starts with invalid character \'-\'', () => {
      expect(() => {
        new imagedeploy.DockerImageDeployment(stack, 'TestStartInvalidCharacterDash', {
          source: testSource,
          destination: imagedeploy.Destination.ecr(repo, { tag: '-testTag123' }),
        });
      }).toThrow('Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'');
    });

    test('tag starts with invalid character \'.\'', () => {
      expect(() => {
        new imagedeploy.DockerImageDeployment(stack, 'TestStartInvalidCharacterPeriod', {
          source: testSource,
          destination: imagedeploy.Destination.ecr(repo, { tag: '.testTag123' }),
        });
      }).toThrow('Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'');
    });

    test('tag is over max length', () => {
      expect(() => {
        new imagedeploy.DockerImageDeployment(stack, 'TestMaxTagLength', {
          source: testSource,
          destination: imagedeploy.Destination.ecr(repo, { tag: 'longtag-10longtag-20longtag-30longtag-40longtag-50longtag-60longtag-70longtag-80longtag-90longtag-101logestTagOneCharacterOver128' }),
        });
      }).toThrow('Invalid tag: tags may contain a maximum of 128 characters');
    });
  });


});