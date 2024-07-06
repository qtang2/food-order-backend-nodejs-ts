import { IsEmail, IsEmpty, isEmpty, Length } from "class-validator";
export class CreateCustomerInput {
    @IsEmail()
    email: string;

    @Length(7,12)
    password: string;

    @Length(6,12)
    phone: string;
}