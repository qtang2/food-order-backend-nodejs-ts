import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../config";
import { VendorPayload } from "../dto";
import { Request } from "express";
import { AuthPayload } from "../dto/AuthPayload";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: VendorPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    ) as AuthPayload;

    // inject user to the express Request
    req.user = payload;

    return true;
  }
};
