// handle admin route stuff, business logic
import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVendor } from "./AdminController";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food, FoodDoc } from "../models/Food";
import { Vendor } from "../models";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
};
export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode, serviceAvailable: false })
    .sort([["rating", "descending"]])
    .limit(1);

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "Data not found" });
};
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    const foodResult: any = [];
    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: "Data not found" });
};
export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    const foodResult: any = [];
    result.map((vendor) => {
      foodResult.push(...vendor.foods);
    });
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: "Data not found" });
};
export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const result = await Vendor.findById(id);
  if (result) {
    return res.status(200).json(result);
  }
  return res.json({ message: "Vendor data not found" });
};
export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const result = await Vendor.findById(id);
  if (result) {
    return res.status(200).json(result);
  }
  return res.json({ message: "Vendor data not found" });
};
