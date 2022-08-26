/**
 * Login commands for specified registry
 */
export interface LoginConfig {
  /**
   * Command to run in codebuild to login.
   * Formatted `docker login ...`.
   */
  readonly loginCommand: string;

  /**
   * Region of ECR repository.
   *
   * @default - undefined if not an ECR repository
   */
  readonly region?: string;
}