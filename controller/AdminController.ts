// handle admin route stuff, business logic
import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { generatePassword, generateSalt } from "../utility";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVendorInput>req.body;

  const existingVendor = await Vendor.findOne({email})


  if(existingVendor != null) {
    return res.json({message: `Vendor with email:${email} exist`})
  }

  const salt = await generateSalt()

  const userPassword = await generatePassword(password, salt)


  const createVendor = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    
  });

  return res.json(createVendor);
};
export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
