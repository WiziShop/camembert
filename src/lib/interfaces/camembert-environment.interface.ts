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
   * If you don't want that Camembert pass more info that's needed
   */
  verbose?: boolean;
}
