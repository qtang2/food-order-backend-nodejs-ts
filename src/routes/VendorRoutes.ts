import express from "express";
import multer from "multer";
import {
  AddFood,
  GetFoods,
  GetVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from "../controller";
import { Authenticate } from "../middlewares";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({
  storage: imageStorage,
}).array("images", 10);

router.post("/login", VendorLogin);

router.use(Authenticate);
// router.get('/profile', Authenticate, GetVendorProfile)
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/service", UpdateVendorService);
router.patch("/coverimage", images, UpdateVendorCoverImage);

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);

export { router as VendorRoute };
