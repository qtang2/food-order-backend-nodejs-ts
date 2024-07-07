"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controller_1 = require("../controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    },
});
const images = (0, multer_1.default)({
    storage: imageStorage,
}).array("images", 10);
router.post("/login", controller_1.VendorLogin);
router.use(middlewares_1.Authenticate);
// router.get('/profile', Authenticate, GetVendorProfile)
router.get("/profile", controller_1.GetVendorProfile);
router.patch("/profile", controller_1.UpdateVendorProfile);
router.patch("/service", controller_1.UpdateVendorService);
router.patch("/coverimage", images, controller_1.UpdateVendorCoverImage);
router.post("/food", images, controller_1.AddFood);
router.get("/foods", controller_1.GetFoods);
//# sourceMappingURL=VendorRoutes.js.map