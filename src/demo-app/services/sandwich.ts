import {CamembertInjectable} from 'camembert/decorators/camembert-injectable.decorator.js';

@CamembertInjectable()
export class Sandwich {
  eat(content: any) {
    return 'Just ate your sandwich with: ' + content;
  }
}
