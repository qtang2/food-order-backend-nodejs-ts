import express from "express";
import { Authenticate } from "../middlewares";
import {
  ChangeDeliveryUserStatus,
  DeliveryUserLogin,
  DeliveryUserSignUp,
  EditDeliveryUserProfile,
  GetDeliveryUserProfile,
} from "../controller/DeliveryController";

const router = express.Router();

/**
|--------------------------------------------------
| Sign up/ create customer
|--------------------------------------------------
*/
router.post("/signup", DeliveryUserSignUp);
/**
|--------------------------------------------------
| Login
|--------------------------------------------------
*/
router.post("/login", DeliveryUserLogin);
// Authentication
router.use(Authenticate);

/**
|--------------------------------------------------
| Change Status
|--------------------------------------------------
*/
router.put("/change-status", ChangeDeliveryUserStatus);

/**
|--------------------------------------------------
| Profile
|--------------------------------------------------
*/
router.get("/profile", GetDeliveryUserProfile);
router.patch("/profile", EditDeliveryUserProfile);

export { router as DeliveryRoute };
