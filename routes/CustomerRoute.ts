import express from "express";
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  RequestOtp,
} from "../controller";
import { Authenticate } from "../middlewares";

const router = express.Router();

/**
|--------------------------------------------------
| Sign up/ create customer
|--------------------------------------------------
*/
router.post("/signup", CustomerSignUp);
/**
|--------------------------------------------------
| Login
|--------------------------------------------------
*/
router.post("/login", CustomerLogin);
/**
|--------------------------------------------------
| Verify customer account
|--------------------------------------------------
*/
router.patch("/verify", CustomerVerify);

// Authentication
/**
|--------------------------------------------------
| OTP/ Requesting OTP
|--------------------------------------------------
*/
router.get("/otp", RequestOtp);

/**
|--------------------------------------------------
| Profile
|--------------------------------------------------
*/
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);

//Cart
// Order
// Payment

export { router as CustomerRoute };
