import { Router } from "express";
const router = Router();
import {
  addlocation,
  deletelocation,
  getlocation,
  updatelocation,
} from "../controllers/locationController";
import { body } from "express-validator";
import { isLogin } from "../middlewares/passwordJWT";
import { isAdmin } from "../middlewares/checkAdmin";

router.get("/", getlocation);
router.post(
  "/",
  [
    isLogin,
    isAdmin,
    body("address").not().isEmpty().withMessage("Address cannot be empty."),
    body("openTime").not().isEmpty().withMessage("Open Time cannot be empty."),
    body("closeTime").not().isEmpty().withMessage("Open Time cannot be empty."),
    body("cords.lat")
      .not()
      .isEmpty()
      .withMessage("Lat in Cords cannot be empty.")
      .isNumeric()
      .withMessage("Lat in Cords must be a number"),
    body("cords.lgn")
      .not()
      .isEmpty()
      .withMessage("Lgn in Cords cannot be empty.")
      .isNumeric()
      .withMessage("Lgn in Cords must be a number"),
  ],
  addlocation
);
router.put("/:id", [isLogin, isAdmin], updatelocation);
router.delete("/:id", [isLogin, isAdmin], deletelocation);

export default router;
