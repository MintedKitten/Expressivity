import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.user as IUser;
  if (role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: { message: "Not authorized" } });
  }
};

export { isAdmin };
