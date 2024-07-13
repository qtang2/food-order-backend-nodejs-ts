// handle admin route stuff, business logic
import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utility";
import {
  CreateDeliveryUserInput,
  CustomerPayload,
  EditCustomerProfileInput,
  UserLoginInput,
} from "../dto/Customer";
import { DeliveryUser } from "../models";

export const DeliveryUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const createDeliveryUserInputs = plainToClass(
    CreateDeliveryUserInput,
    req.body
  );
  const inputErrors = await validate(createDeliveryUserInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password, phone, address, pincode, firstName, lastName } =
    createDeliveryUserInputs;

  const existingDeliveryUser = await DeliveryUser.findOne({ email });

  if (existingDeliveryUser != null) {
    return res
      .status(400)
      .json({ message: "Delivery user with email provided already exist" });
  }

  const salt = await GenerateSalt();

  const userPassword = await GeneratePassword(password, salt);

  const result = await DeliveryUser.create({
    email,
    password: userPassword,
    salt,
    phone,
    firstName,
    lastName,
    address,
    pincode,
    lat: 0,
    lng: 0,
    verified: false,
    isAvailable: false,
  });

  if (result != null) {
    // generate the signature
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    } as CustomerPayload);
    // send the result

    return res
      .status(200)
      .json({ signature, email: result.email, verified: result.verified });
  }

  return res.status(400).json({ message: "Error with delivery user sign up" });
};
export const DeliveryUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userLoginInput = plainToClass(UserLoginInput, req.body);
  const inputErrors = await validate(userLoginInput, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password } = userLoginInput;
  const deliveryUser = await DeliveryUser.findOne({ email });

  if (deliveryUser != null) {
    const validate = await ValidatePassword(
      password,
      deliveryUser.password,
      deliveryUser.salt
    );

    if (validate) {
      // generate the signature
      const signature = GenerateSignature({
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      } as CustomerPayload);
      // send the result

      return res.status(201).json({
        signature,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });
    }
  }

  return res.status(404).json({ message: "Login Error" });
};

export const GetDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;
  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: "Error with get profile " });
};
export const EditDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  const profileInputs = plainToClass(EditCustomerProfileInput, req.body);

  const inputErrors = await validate(profileInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { address, firstName, lastName } = profileInputs;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const updatedProfile = await profile.save();
      return res.status(200).json(updatedProfile);
    }
  }
  return res.status(400).json({ message: "Error with edit profile " });
};
export const ChangeDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;
  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);
    if (profile) {
      const { lat, lng } = req.body;
      if (lat && lng) {
        profile.lat = lat;
        profile.lng = lng;
      }
      profile.isAvailable = !profile.isAvailable;
      const updatedProfile = await profile.save();
      return res.status(200).json(updatedProfile);
    }
  }
  return res.status(400).json({ message: "Error with update status of profile " });
};
