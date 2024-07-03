// handle admin route stuff, business logic
import { Request, Response, NextFunction } from "express";
import { VendorLoginInput } from "../dto";
import { validatePassword } from "../utility";
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
      return res.json(vendor);
    }
  }

  return res.json({ message: "Vendor data not exist" });
};
