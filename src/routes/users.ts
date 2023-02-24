import { Router } from "express";
const router = Router();
import {
  index,
  bio,
  register,
  login,
  profile,
} from "../controllers/userController";
import { body } from "express-validator";
import { isLogin } from "../middlewares/passwordJWT";

router.get("/", index);
router.get("/bio", bio);
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Name cannot be empty"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email cannot be empty")
      .isEmail()
      .withMessage("Email is not correctly formatted"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 5 })
      .withMessage("Password length must be as least 5 characters"),
  ],
  register
);
router.post(
  "/login",
  [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email cannot be empty")
      .isEmail()
      .withMessage("Email is not correctly formatted"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 5 })
      .withMessage("Password length must be as least 5 characters"),
  ],
  login
);
router.get("/me", [isLogin], profile);

export default router;
