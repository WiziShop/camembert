export interface CamembertRouteConfig {
  controller: Object;
  path: string;
  httpMethod: string;
  action: Function;
  beforeMiddleware: Function[];
  afterMiddleware: Function[];
}
