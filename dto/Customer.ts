import { IsEmail, IsEmpty, isEmpty, Length } from "class-validator";

// for validation, the declare type has to be class
export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  password: string;

  @Length(6, 12)
  phone: string;
}

export class EditCustomerProfileInput {
  @Length(3, 16)
  firstName: string;

  @Length(3, 16)
  lastName: string;

  @Length(6, 16)
  address: string;
}
export class UserLoginInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  password: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}
