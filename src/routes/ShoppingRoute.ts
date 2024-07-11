import express from "express";
import { GetAvailableOffers, GetFoodAvailability, GetFoodsIn30Min, GetRestaurantById, GetTopRestaurant, SearchFoods } from "../controller/ShoppingController";


const router = express.Router();

/**
|--------------------------------------------------
| Food Availability
|--------------------------------------------------
*/
router.get('/:pincode', GetFoodAvailability)
/**
|--------------------------------------------------
| Top Restaurant
|--------------------------------------------------
*/
router.get('/top-restaurant/:pincode', GetTopRestaurant)

/**
|--------------------------------------------------
| Food Available in 30 min
|--------------------------------------------------
*/
router.get('/food-in-30-min/:pincode', GetFoodsIn30Min)

/**
|--------------------------------------------------
| Search Food
|--------------------------------------------------
*/
router.get('/search/:pincode', SearchFoods)
/**
|--------------------------------------------------
| Search Offer
|--------------------------------------------------
*/
router.get('/offers/:pincode', GetAvailableOffers)

/**
|--------------------------------------------------
| Find Restaurant by ID
|--------------------------------------------------
*/
router.get('/restaurant/:id', GetRestaurantById)


export { router as ShoppingRoute };
