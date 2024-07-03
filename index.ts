import express from "express";
import bodyParser from "body-parser";
import { AdminRoute, VendorRoute } from "./routes";
import mongoose from "mongoose";
import { MONGO_URI } from "./config";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

mongoose.connect(MONGO_URI).then(result => {
    console.log('============= Connected! =======================');
}).catch(err => {
    console.log('error connect database', err);
})

app.listen(8080, () => {});
