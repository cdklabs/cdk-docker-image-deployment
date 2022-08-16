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

      test('docker tag command is well formatted: tag provided', () => {
        //console.log(JSON.stringify(Template.fromStack(stack).findResources('AWS::CodeBuild::Project'), null, 4));
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
        //console.log(JSON.stringify(Template.fromStack(stack).findResources('AWS::CodeBuild::Project'), null, 4));
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
                  Match.stringLikeRegexp('^:70d1a3115d17d2ad7210b272e45b7398a7661e7b0cf24b52e059ae3f1fa8f2c1",(.)*'),
                ]),
              ]),
            },
          },
        });
      });

    });

    test('ECR login and pull commands are well formatted', () => {
      //console.log(JSON.stringify(Template.fromStack(stack).findResources('AWS::CodeBuild::Project'), null, 4));
      Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
          BuildSpec: {
            'Fn::Join': Match.arrayWith([
              Match.arrayWith([
                '{\n  "version": "0.2",\n  "phases": {\n    "pre_build": {\n      "commands": [\n        "aws ecr get-login-password --region ',
                { Ref: 'AWS::Region' },
                ' | docker login --username AWS --password-stdin ',
                { Ref: 'AWS::AccountId' },
                '.dkr.ecr.',
                { Ref: 'AWS::Region' },
                '.amazonaws.com"\n      ]\n    },\n    "build": {\n      "commands": [\n        "docker pull ',
                { 'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:70d1a3115d17d2ad7210b272e45b7398a7661e7b0cf24b52e059ae3f1fa8f2c1' },
              ]),
            ]),
          },
        },
      });
    });
  });
});

describe('Destination', () => {
  describe('Tag validation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const repo = new ecr.Repository(stack, 'TestRepository');

    test('valid tag', () => {
      expect(imagedeploy.Destination.ecr(repo, { tag: '_test_TEST-1234.tag-' }).config.destinationTag).toEqual('_test_TEST-1234.tag-');
    });

    test('options not provided does not throw', () => {
      expect(imagedeploy.Destination.ecr(repo).config.destinationTag).toEqual(undefined);
    });

    test('tag not provided does not throw', () => {
      expect(imagedeploy.Destination.ecr(repo, {}).config.destinationTag).toEqual(undefined);
    });

    test('empyty tag', () => {
      expect(() => {
        imagedeploy.Destination.ecr(repo, { tag: '' });
      }).toThrow('Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'');
    });

    test('tag contains invalid character', () => {
      expect(() => {
        imagedeploy.Destination.ecr(repo, { tag: 'testTag123!' });
      }).toThrow('Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'');
    });

    test('tag starts with invalid character \'-\'', () => {
      expect(() => {
        imagedeploy.Destination.ecr(repo, { tag: '-testTag123' });
      }).toThrow('Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'');
    });

    test('tag starts with invalid character \'.\'', () => {
      expect(() => {
        imagedeploy.Destination.ecr(repo, { tag: '.testTag123' });
      }).toThrow('Invalid tag: tags must contain alphanumeric characters and \'-\' \'_\' \'.\' only and must not begin with \'.\' or \'-\'');
    });

    test('tag is over max length', () => {
      expect(() => {
        imagedeploy.Destination.ecr(repo, { tag: 'longtag-10longtag-20longtag-30longtag-40longtag-50longtag-60longtag-70longtag-80longtag-90longtag-101logestTagOneCharacterOver128' });
      }).toThrow('Invalid tag: tags may contain a maximum of 128 characters');
    });
  });
});