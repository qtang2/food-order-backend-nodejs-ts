import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderDoc } from "./Order";

interface CustomerDoc extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  cart: [any];
  orders: [OrderDoc];
}

const CustomerSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number },
    lng: { type: Number },
    orders: [{ type: Schema.Types.ObjectId, ref: "order" }],
    cart: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food" },
        unit: { type: Number },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.salt;
        delete ret.password;
        delete ret.createdAt;
        delete ret.__v;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>("Customer", CustomerSchema);

export { Customer };
