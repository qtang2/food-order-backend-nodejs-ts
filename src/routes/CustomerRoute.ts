import express from "express";
import {
  CreateOrder,
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  EditCustomerProfile,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
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
// Authentication
router.use(Authenticate)
/**
|--------------------------------------------------
| Verify customer account
|--------------------------------------------------
*/
router.patch("/verify", CustomerVerify);


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
// Payment


// Order
router.post("/create-order", CreateOrder);
router.post("/orders", GetOrders);
router.post("/order/:id", GetOrderById);



export { router as CustomerRoute };
