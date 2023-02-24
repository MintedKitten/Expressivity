import { Router } from "express";
const router = Router();
import {
  getproduct,
  getoneproduct,
  addproduct,
  updateproduct,
  deleteproduct,
} from "../controllers/productController";
import { body } from "express-validator";
import { isLogin } from "../middlewares/passwordJWT";
import { isAdmin } from "../middlewares/checkAdmin";

router.get("/", getproduct);
router.get("/:id", getoneproduct);
router.post(
  "/",
  [
    isLogin,
    isAdmin,
    body("name").not().isEmpty().withMessage("Name cannot be empty."),
    body("description")
      .not()
      .isEmpty()
      .withMessage("Description cannot be empty."),
    body("price")
      .not()
      .isEmpty()
      .withMessage("Price cannot be empty.")
      .isNumeric()
      .withMessage("Price must be a number"),
    body("categoryId")
      .not()
      .isEmpty()
      .withMessage("Category Id cannot be empty."),
  ],
  addproduct
);
router.put("/:id", [isLogin, isAdmin], updateproduct);
router.delete("/:id", [isLogin, isAdmin], deleteproduct);

export default router;
