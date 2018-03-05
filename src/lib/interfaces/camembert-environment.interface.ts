export interface CamembertEnvironment {
  /**
   * The server's port number
   */
  port: number;

  /**
   * The list to all controllers in Javascript not Typescript which will be imported into the app
   * You can enter a pattern like: __dirname + '/controllers/** /*.js'
   */
  controllersPath: string[];

  /**
   * Adding a verbose value
   */
  verbose?: boolean;
}
