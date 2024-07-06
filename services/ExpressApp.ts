import express, { Application } from "express";
import bodyParser from "body-parser";
import { AdminRoute, VendorRoute, CustomerRoute, ShoppingRoute} from "../routes";
import path from "path";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "images"))); //  for save the image in the local storage

  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/customer", CustomerRoute);
  app.use(ShoppingRoute);

  return app;
};
