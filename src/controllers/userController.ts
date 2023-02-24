import { validationResult } from "express-validator";
import { IUser, user } from "../models/user";
import { JwtPayload, decode, sign } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/errorHandler";

const index = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ fullname: "Korndanai" });
};

const bio = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({
    fullname: "Korndanai Ananjinda",
    nickname: "Sky",
    hobby: "Listening to Music",
    gitusername: "MintedKitten",
  });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Input is incorrect");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    // Check email
    const isEmailExist = await user.findOne({ email: email });
    if (isEmailExist) {
      const error = new CustomError("Register Error: Email already exists");
      error.statusCode = 405;
      throw error;
    }
    try {
      let userinsert = new user();
      userinsert.name = name;
      userinsert.email = email;
      userinsert.password = await userinsert.encryptPassword(password);
      await userinsert.save();
      return res.status(200).json({ message: "Register successful!" });
    } catch (e) {
      const et = e as Error;
      const error = new CustomError(`Register Error: ${et.message}`);
      error.statusCode = 405;
      throw error;
    }
  } catch (e) {
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Input is incorrect");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    // Check user
    const isUserExist = await user.findOne({ email: email });
    if (!isUserExist) {
      const error = new CustomError("Login Error: Can't find this user");
      error.statusCode = 404;
      throw error;
    }
    // Check password
    const isValid = await isUserExist.checkPassword(password);
    if (!isValid) {
      const error = new CustomError("Login Error: Password is incorrect");
      error.statusCode = 401;
      throw error;
    }

    // Create JWT
    const token = sign(
      {
        id: isUserExist._id,
      },
      JWT_SECRET,
      { expiresIn: "5 days" }
    );
    const expired_in = decode(token) as JwtPayload;

    return res.status(200).json({
      access_token: token,
      expired_in: expired_in.exp,
      token_type: "Bearer",
    });
  } catch (e) {
    next(e);
  }
};

const profile = async (req: Request, res: Response, next: NextFunction) => {
  const { role, name, email } = req.user as IUser;
  return res
    .status(200)
    .json({ data: { name: name, email: email, role: role } });
};

export { index, bio, register, login, profile };
