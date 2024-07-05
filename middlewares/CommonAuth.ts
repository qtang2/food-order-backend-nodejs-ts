// inject the user in the express Request
import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/AuthPayload";
import { ValidateSignature } from "../utility";

// middleware is a function that handling the request right before performing some actions and giving some response
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await ValidateSignature(req);
  if (validate) {
    next();
  } else {
    return res.json({ message: "User not authorized" });
  }
};
