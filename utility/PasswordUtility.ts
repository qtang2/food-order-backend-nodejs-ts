import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../config'
import { VendorPayload } from '../dto'

export const generateSalt = async () => {
    return await bcrypt.genSalt()
}
export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}
export const validatePassword = async (enteredPassword: string,savedPassword: string, salt: string) => {
    return await generatePassword(enteredPassword, salt) === savedPassword
}
export const generateSignature = (payload: VendorPayload) => {
    return jwt.sign(payload, APP_SECRET, {expiresIn: '1d'})
}