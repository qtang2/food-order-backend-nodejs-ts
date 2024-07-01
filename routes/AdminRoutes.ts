
import express, {Request, Response, NextFunction} from 'express'
import { CreateVendor, GetVendorByID, GetVendors } from '../controller'


const router = express.Router()

router.post('/vendor', (req: Request, res: Response, next: NextFunction) => {
    return CreateVendor(req, res, next)
})
router.get('/vendors', GetVendors)
router.get('/vendor/:id', GetVendorByID)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from admin"})
})

export {router as AdminRoute}