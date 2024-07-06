import express from "express";
import dbConnection from "./services/Database";
import ExpressApp from "./services/ExpressApp";

const StartServer = async () => {
  const app = express();
  await dbConnection();

  await ExpressApp(app);

  app.listen(8080, () => {
    console.log('====================================');
    console.log('server listening to port 8080');
    console.log('====================================');
  })
};

StartServer()
