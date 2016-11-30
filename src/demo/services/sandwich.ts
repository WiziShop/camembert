import {CamembertInjectable} from "../../app/decorators/camembert-injectable.decorator";

@CamembertInjectable()
export class Sandwich {
  eat(content: any) {
    return 'Just ate your sandwich with: ' + content;
  }
}
