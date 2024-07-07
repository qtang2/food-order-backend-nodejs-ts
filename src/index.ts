import express from "express";
import dbConnection from "./services/Database";
import ExpressApp from "./services/ExpressApp";
import { PORT } from "./config";

const StartServer = async () => {
  const app = express();
  await dbConnection();

  await ExpressApp(app);

  app.listen(PORT, () => {
    console.log('====================================');
    console.log('server listening to port ' + PORT);
    console.log('====================================');
  })
};

StartServer()
