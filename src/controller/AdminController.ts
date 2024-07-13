// handle admin route stuff, business logic
import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";
import { Transaction } from "../models/Transaction";

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email });
  } else {
    return await Vendor.findById(id);
  }
};

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

  const existingVendor = await FindVendor(undefined, email)

  if (existingVendor != null) {
    return res.json({ message: `Vendor with email:${email} exist` });
  }

  const salt = await GenerateSalt();

  const userPassword = await GeneratePassword(password, salt);

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
    lat:0,
    lng: 0
  });

  return res.json(createVendor);``
};
export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  if (vendors !== null) {
    return res.json(vendors);
  }

  return res.json({ message: "Vendors data not available" });
};
export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;

  const vendor = await FindVendor(vendorId)
  if (vendor !== null) {
    return res.json(vendor);
  }

  return res.json({ message: "Vendor data not available" });
};
export const GetTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactions = await Transaction.find();

  if (transactions !== null) {
    return res.json(transactions);
  }

  return res.json({ message: "Transactions data not available" });
};
export const GetTransactionByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactionId = req.params.id;

  const transaction = await Transaction.findById(transactionId)
  if (transaction !== null) {
    return res.json(transaction);
  }

  return res.json({ message: "Transaction data not available" });
};
