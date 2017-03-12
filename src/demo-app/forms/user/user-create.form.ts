import {IsEmail, NotEmpty} from "validator.ts/decorator/Validation";
import {CamembertForm} from 'camembert';
import {Validator} from "validator.ts/Validator";

@CamembertForm((req, res, next, form: UserCreateForm) => {
  let validator = new Validator();

  if (validator.isValid(form)) {
    return next();
  }
  res.status(400).send('Invalid Form');
})
export class UserCreateForm {
  @IsEmail()
  email: string = '';

  @NotEmpty()
  firstName: string = '';

  @NotEmpty()
  lastName: string = '';

  @NotEmpty()
  password: string = '';

}
