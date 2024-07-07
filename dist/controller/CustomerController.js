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
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_1 = require("../dto/Customer");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const Customer_2 = require("../models/Customer");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createCustomerInputs = (0, class_transformer_1.plainToClass)(Customer_1.CreateCustomerInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(createCustomerInputs, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password, phone } = createCustomerInputs;
    const existingCustomer = yield Customer_2.Customer.findOne({ email });
    if (existingCustomer != null) {
        return res
            .status(400)
            .json({ message: "Customer with email provided already exist" });
    }
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOtp)();
    const result = yield Customer_2.Customer.create({
        email,
        password: userPassword,
        salt,
        phone,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        otp,
        otp_expiry: expiry,
        lat: 0,
        lng: 0,
    });
    if (result != null) {
        // generate otp, send otp to customer, need to buy number from twolio, not doing it now
        // await onRequestOtp(otp, phone)
        // generate the signature
        const signature = (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified,
        });
        // send the result
        return res
            .status(200)
            .json({ signature, email: result.email, verified: result.verified });
    }
    return res.status(400).json({ message: "Error with sign up" });
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userLoginInput = (0, class_transformer_1.plainToClass)(Customer_1.UserLoginInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(userLoginInput, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password } = userLoginInput;
    const customer = yield Customer_2.Customer.findOne({ email });
    if (customer != null) {
        const validate = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validate) {
            // generate the signature
            const signature = (0, utility_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified,
            });
            // send the result
            return res.status(201).json({
                signature,
                email: customer.email,
                verified: customer.verified,
            });
        }
    }
    return res.status(404).json({ message: "Login Error" });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_2.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedProfile = yield profile.save();
                const signature = (0, utility_1.GenerateSignature)({
                    _id: updatedProfile._id,
                    email: updatedProfile.email,
                    verified: updatedProfile.verified,
                });
                return res.status(201).json({
                    signature,
                    email: updatedProfile.email,
                    verified: updatedProfile.verified,
                });
            }
        }
    }
    return res.status(400).json({ message: "Error with verification " });
});
exports.CustomerVerify = CustomerVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_2.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            // await onRequestOTP(otp, profile.phone) // no phone registered to send the otp
            return res
                .status(200)
                .json({ message: "OTP send to your registered phone number" });
        }
    }
    return res.status(400).json({ message: "Error with request otp " });
});
exports.RequestOtp = RequestOtp;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_2.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: "Error with get profile " });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_2.Customer.findById(customer._id);
        if (profile) {
            const { firstName, lastName, address } = req.body;
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const updatedProfile = yield profile.save();
            return res.status(200).json(updatedProfile);
        }
    }
    return res.status(400).json({ message: "Error with edit profile " });
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map