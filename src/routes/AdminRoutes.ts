
import express, {Request, Response, NextFunction} from 'express'
import { CreateVendor, GetTransactionByID, GetTransactions, GetVendorByID, GetVendors } from '../controller'


const router = express.Router()

router.post('/vendor', (req: Request, res: Response, next: NextFunction) => {
    return CreateVendor(req, res, next)
})
router.get('/vendors', GetVendors)
router.get('/vendor/:id', GetVendorByID)

router.get('/transactions', GetTransactions)
router.get('/transaction/:id', GetTransactionByID)
router.get('/delivery/verify', VerifyDeliveryUser)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "Hello from admin"})
})

export {router as AdminRoute}