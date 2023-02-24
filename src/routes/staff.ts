import { Router } from "express";
const router = Router();
import {
  getstaff,
  poststaff,
  showstaff,
  removestaff,
  updatestaff,
} from "../controllers/staffController";
import { body } from "express-validator";
import { isLogin } from "../middlewares/passwordJWT";

router.get("/", [isLogin], getstaff);
router.get("/:id", showstaff);
router.put("/:id", updatestaff);
router.delete("/:id", removestaff);
router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("Name cannot be empty."),
    body("salary")
      .not()
      .isEmpty()
      .withMessage("Salary cannot be empty.")
      .isNumeric()
      .withMessage("Salary must be a number"),
  ],
  poststaff
);

export default router;
