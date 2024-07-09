// handle admin route stuff, business logic
import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindVendor } from "./AdminController";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food } from "../models/Food";
import { Vendor } from "../models";
import { Order } from "../models/Order";
import { OrderInput } from "../dto/Customer";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const vendor = await FindVendor(undefined, email);
  if (vendor != null) {
    const validation = await ValidatePassword(
      password,
      vendor.password,
      vendor.salt
    );
    if (validation) {
      // allow login
      const signature = GenerateSignature({
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
) => {
  // req.user exist means the api pass the authentication process
  const user = req.user;
  if (user) {
    const existingUser = await FindVendor(user._id);

    return res.json(existingUser);
  }
  return res.json({ message: "Vendor data not found" });
};
export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, foodType, address } = <EditVendorInput>req.body;
  const user = req.user;
  if (user) {
    const existingUser = await FindVendor(user._id);
    if (existingUser != null) {
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.foodType = foodType;
      existingUser.address = address;

      await existingUser.save();
    }

    return res.json(existingUser);
  }
  return res.json({ message: "Vendor data not found" });
};
export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor != null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      existingVendor.coverImages.push(...images);
      const result = await existingVendor.save();

      return res.json(result);
    }
  }
  return res.json({ message: "Vendor data not found" });
};
export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingUser = await FindVendor(user._id);
    if (existingUser != null) {
      existingUser.serviceAvailable = !existingUser.serviceAvailable;

      await existingUser.save();
    }

    return res.json(existingUser);
  }
  return res.json({ message: "Vendor data not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // req.user exist means the api pass the authentication process
  const user = req.user;
  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInput
    >req.body;

    const existingVendor = await FindVendor(user._id);
    if (existingVendor != null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const savedFood = await Food.create({
        vendorId: existingVendor._id,
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        images,
        rating: 0,
      });
      existingVendor.foods.push(savedFood);
      const result = await existingVendor.save();
      return res.json(result);
    }
  }
  return res.json({ message: "Vendor data not found" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // req.user exist means the api pass the authentication process
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods != null) {
      return res.json(foods);
    }
  }
  return res.json({ message: "Vendor food not found" });
};
export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );
    if (orders != null) {
      return res.status(200).json(orders);
    }
  }
  return res.status(400).json({ message: "Vendor orders not found" });
};
export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    if (order != null) {
      return res.status(200).json(order);
    }
  }
  return res.status(400).json({ message: "Vendor order not found" });
};
export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const {status, remarks, time} = req.body
  if (orderId) { 

    const order = await Order.findById(orderId)

    if(order !== null) {
      order.orderStatus = status
      order.remarks = remarks
      order.readyTime = time

      const orderResult = await order.save()

      return res.status(200).json(orderResult)
    }

  }

  return res.status(400).json({ message: "Unable to process order" });

  
};
