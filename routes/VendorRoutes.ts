
import express, {Request, Response, NextFunction} from 'express'
import { VendorLogin } from '../controller'

const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({message: "Hello from vendor"})
})
router.post('/login', VendorLogin)

export {router as VendorRoute}