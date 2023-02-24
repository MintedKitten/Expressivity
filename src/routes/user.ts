import { Router } from "express";
const router = Router();
import { register, login, getprofile } from "../controllers/userController";
import { body } from "express-validator";
import { isLogin } from "../middlewares/passwordJWT";

router.get("/profile", [isLogin], getprofile);
router.post(
  "/register",
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
    body("address").not().isEmpty().withMessage("Address cannot be empty"),
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

export default router;
