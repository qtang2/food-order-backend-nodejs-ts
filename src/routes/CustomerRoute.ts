import express from "express";
import {
  AddCart,
  CreateOrder,
  CreatePayment,
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  DeleteCart,
  EditCustomerProfile,
  GetCart,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
  VerifyOffer,
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
router.post("/cart", AddCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

// Payment
router.post("/create-payment", CreatePayment);


// Order
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);

// apply offer for customer
router.get("/offer/verify/:id", VerifyOffer);


export { router as CustomerRoute };
