// handle admin route stuff, business logic
import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { Food, FoodDoc } from "../models/Food";
import { Vendor } from "../models";
import {
  CreateCustomerInput,
  CustomerPayload,
  EditCustomerProfileInput,
  OrderInput,
  UserLoginInput,
} from "../dto/Customer";
import { validate } from "class-validator";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOTP,
  ValidatePassword,
} from "../utility";
import { Customer } from "../models/Customer";
import { Order } from "../models/Order";
import { Offer } from "../models/Offer";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const createCustomerInputs = plainToClass(CreateCustomerInput, req.body);
  const inputErrors = await validate(createCustomerInputs, {
    validationError: { target: true },
  });
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password, phone } = createCustomerInputs;

  const existingCustomer = await Customer.findOne({ email });

  if (existingCustomer != null) {
    return res
      .status(400)
      .json({ message: "Customer with email provided already exist" });
  }

  const salt = await GenerateSalt();

  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();

  const result = await Customer.create({
    email,
    password: userPassword,
    salt,
    phone,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    otp,
    otp_expiry: expiry,
    lat: 0,
    lng: 0,
    orders: [],
  });

  if (result != null) {
    // generate otp, send otp to customer, need to buy number from twolio, not doing it now
    // await onRequestOtp(otp, phone)

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

  return res.status(400).json({ message: "Error with sign up" });
};
export const CustomerLogin = async (
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
  const customer = await Customer.findOne({ email });

  if (customer != null) {
    const validate = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validate) {
      // generate the signature
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      } as CustomerPayload);
      // send the result

      return res.status(201).json({
        signature,
        email: customer.email,
        verified: customer.verified,
      });
    }
  }

  return res.status(404).json({ message: "Login Error" });
};
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;

  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedProfile = await profile.save();

        const signature = GenerateSignature({
          _id: updatedProfile._id,
          email: updatedProfile.email,
          verified: updatedProfile.verified,
        } as CustomerPayload);

        return res.status(201).json({
          signature,
          email: updatedProfile.email,
          verified: updatedProfile.verified,
        });
      }
    }
  }

  return res.status(400).json({ message: "Error with verification " });
};
export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOtp();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();

      // await onRequestOTP(otp, profile.phone) // no phone registered to send the otp

      return res
        .status(200)
        .json({ message: "OTP send to your registered phone number" });
    }
  }
  return res.status(400).json({ message: "Error with request otp " });
};
export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: "Error with get profile " });
};
export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { firstName, lastName, address } = <EditCustomerProfileInput>(
        req.body
      );

      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const updatedProfile = await profile.save();
      return res.status(200).json(updatedProfile);
    }
  }
  return res.status(400).json({ message: "Error with edit profile " });
};

/**
|--------------------------------------------------
| Cart section
|--------------------------------------------------
*/
export const AddCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");

    const { _id, unit } = <OrderInput>req.body;
    let cartItems = Array();

    const food = await Food.findById(_id);
    if (food != null) {
      if (profile != null) {
        cartItems = profile.cart;
        if (cartItems.length > 0) {
          // check and update unit
          const existingFoodItem = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );
          if (existingFoodItem.length > 0) {
            const index = cartItems.indexOf(existingFoodItem[0]);
            if (unit > 0) {
              cartItems[index] = {
                food,
                unit,
              };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          // add new item to cart
          cartItems.push({ food, unit });
        }

        if (cartItems) {
          profile.cart = cartItems as [any];

          const cartResult = await profile.save();
          return res.status(200).json(cartResult.cart);
        }
      }
    }
  }

  return res.status(400).json({ message: "Error with add cart " });
};
export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }
  return res.status(400).json({ message: "Error with get cart " });
};
export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      profile.cart = [] as any;
      const cartResult = await profile.save();
      return res.status(200).json(cartResult);
    }
  }
  return res.status(400).json({ message: "Cart already empty" });
};

/**
|--------------------------------------------------
| Order section
|--------------------------------------------------
*/
export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab customer

  const customer = req.user;
  if (customer) {
    // create an order ID
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
    const profile = await Customer.findById(customer._id);

    if (profile) {
      // grab order items from request
      const cart = <[OrderInput]>req.body;

      const cartItems = Array();
      let netAmount = 0.0;

      let vendorId;

      // calculate order amount
      const foods = await Food.find()
        .where("_id")
        .in(cart.map((item) => item._id))
        .exec();

      foods.map((food) => [
        cart.map(({ _id, unit }) => {
          if (_id == food._id) {
            vendorId = food.vendorId;
            netAmount += unit * food.price;
            cartItems.push({ food, unit });
          }
        }),
      ]);
      // create order with item descriptions
      if (cartItems) {
        const currentOrder = await Order.create({
          orderId,
          vendorId,
          items: cartItems,
          totalAmount: netAmount,
          orderDate: new Date(),
          paidThrough: "COD",
          paymentResponse: "",
          orderStatus: "Waiting",
          remarks: "",
          readyTime: 45,
          appliedOffers: false,
          offerId: null,
          deliveryId: null,
        });

        // update the order to the user account
        if (currentOrder) {
          profile.cart = [] as any;
          profile.orders.push(currentOrder);
          await profile.save();

          return res.status(200).json(currentOrder);
        }
      }
    }
  }

  return res.status(400).json({ message: "Error with create order " });
};
export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");

    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }
  return res.status(400).json({ message: "Error get orders " });
};
export const GetOrderById = async (
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

  return res.status(400).json({ message: "Error get orders " });
};
export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offerId = req.params.id;
  const customer = req.user;
  if (customer) {
    if (offerId) {
      const offer = await Offer.findById(offerId);

      if (offer) {
        if (offer.promoType == "USER") {
          // only can apply once per customer
        } else {
          if (offer.isActive) {
            return res.status(200).json({ message: "Offer is valid.", offer });
          }
        }
      }
    }
  }

  return res.status(400).json({ message: "Offer is not valid." });
};
