
import express, {Request, Response, NextFunction} from 'express'
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controller'

const router = express.Router()

router.post('/login', VendorLogin)
router.get('/profile', GetVendorProfile)
router.patch('/profile', UpdateVendorProfile)
router.patch('/service', UpdateVendorService)

export {router as VendorRoute}