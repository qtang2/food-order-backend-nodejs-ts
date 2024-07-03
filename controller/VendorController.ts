// handle admin route stuff, business logic
import { Request, Response, NextFunction } from "express";
import { VendorLoginInput } from "../dto";
import { generateSignature, validatePassword } from "../utility";
import { FindVendor } from "./AdminController";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const vendor = await FindVendor(undefined, email);
  if (vendor != null) {
    const validation = await validatePassword(
      password,
      vendor.password,
      vendor.salt
    );
    if (validation) {
      // allow login
      const signature = generateSignature({
        _id: vendor.id,
        email: vendor.email,
        name: vendor.name,
        foodType: vendor.foodType,
      });
      return res.json(signature);
    } else {
      return res.json({ message: "Invalid username or password" });
    }
  }

  return res.json({ message: "Vendor data not exist" });
};
export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
