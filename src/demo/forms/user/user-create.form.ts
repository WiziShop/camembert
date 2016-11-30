import {IsEmail, NotEmpty} from "validator.ts/decorator/Validation";

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
