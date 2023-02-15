import {CamembertInjectable} from 'camembert';

@CamembertInjectable()
export class Sandwich {
  eat(content: any) {
    return 'Just ate your sandwich with: ' + content;
  }
}
