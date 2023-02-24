import { Router } from "express";
const router = Router();
import { body } from "express-validator";
import {
  index,
  getMenu,
  getShop,
  addShop,
} from "../controllers/shopController";

router.get("/", index);
router.get("/menu", getMenu);
router.get("/:id", getShop);
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Name cannot be empty."),
    body("location.lat")
      .not()
      .isEmpty()
      .withMessage("Lat in Location cannot be empty.")
      .isNumeric()
      .withMessage("Lat in Location must be a number"),
    body("location.lgn")
      .not()
      .isEmpty()
      .withMessage("Lgn in Location cannot be empty.")
      .isNumeric()
      .withMessage("Lgn in Location must be a number"),
  ],
  addShop
);

export default router;
