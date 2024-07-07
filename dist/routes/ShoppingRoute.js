"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const ShoppingController_1 = require("../controller/ShoppingController");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
/**
|--------------------------------------------------
| Food Availability
|--------------------------------------------------
*/
router.get('/:pincode', ShoppingController_1.GetFoodAvailability);
/**
|--------------------------------------------------
| Top Restaurant
|--------------------------------------------------
*/
router.get('/top-restaurant/:pincode', ShoppingController_1.GetTopRestaurant);
/**
|--------------------------------------------------
| Food Available in 30 min
|--------------------------------------------------
*/
router.get('/food-in-30-min/:pincode', ShoppingController_1.GetFoodsIn30Min);
/**
|--------------------------------------------------
| Search Food
|--------------------------------------------------
*/
router.get('/ /:pincode', ShoppingController_1.SearchFoods);
/**
|--------------------------------------------------
| Find Restaurant by ID
|--------------------------------------------------
*/
router.get('/restaurant/:id', ShoppingController_1.GetRestaurantById);
//# sourceMappingURL=ShoppingRoute.js.map