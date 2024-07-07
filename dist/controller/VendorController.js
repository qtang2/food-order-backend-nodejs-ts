"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFoods = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
const utility_1 = require("../utility");
const AdminController_1 = require("./AdminController");
const Food_1 = require("../models/Food");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const vendor = yield (0, AdminController_1.FindVendor)(undefined, email);
    if (vendor != null) {
        const validation = yield (0, utility_1.ValidatePassword)(password, vendor.password, vendor.salt);
        if (validation) {
            // allow login
            const signature = (0, utility_1.GenerateSignature)({
                _id: vendor.id,
                email: vendor.email,
                name: vendor.name,
                foodType: vendor.foodType,
            });
            return res.json(signature);
        }
        else {
            return res.json({ message: "Invalid username or password" });
        }
    }
    return res.json({ message: "Vendor data not exist" });
});
exports.VendorLogin = VendorLogin;
const GetVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // req.user exist means the api pass the authentication process
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        return res.json(existingUser);
    }
    return res.json({ message: "Vendor data not found" });
});
exports.GetVendorProfile = GetVendorProfile;
const UpdateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, foodType, address } = req.body;
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingUser != null) {
            existingUser.name = name;
            existingUser.phone = phone;
            existingUser.foodType = foodType;
            existingUser.address = address;
            yield existingUser.save();
        }
        return res.json(existingUser);
    }
    return res.json({ message: "Vendor data not found" });
});
exports.UpdateVendorProfile = UpdateVendorProfile;
const UpdateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor != null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            existingVendor.coverImages.push(...images);
            const result = yield existingVendor.save();
            return res.json(result);
        }
    }
    return res.json({ message: "Vendor data not found" });
});
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
const UpdateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingUser != null) {
            existingUser.serviceAvailable = !existingUser.serviceAvailable;
            yield existingUser.save();
        }
        return res.json(existingUser);
    }
    return res.json({ message: "Vendor data not found" });
});
exports.UpdateVendorService = UpdateVendorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // req.user exist means the api pass the authentication process
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (existingVendor != null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const savedFood = yield Food_1.Food.create({
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
            const result = yield existingVendor.save();
            return res.json(result);
        }
    }
    return res.json({ message: "Vendor data not found" });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // req.user exist means the api pass the authentication process
    const user = req.user;
    if (user) {
        console.log("=================GetFoods===================");
        console.log(user);
        console.log("====================================");
        const foods = yield Food_1.Food.find({ vendorId: user._id });
        if (foods != null) {
            return res.json(foods);
        }
    }
    return res.json({ message: "Vendor food not found" });
});
exports.GetFoods = GetFoods;
//# sourceMappingURL=VendorController.js.map