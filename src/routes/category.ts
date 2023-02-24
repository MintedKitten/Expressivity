import { Router } from "express";
const router = Router();
import {
  addcategory,
  getcategory,
  getbycategory,
  updatecategory,
  deletecategory,
} from "../controllers/categoryController";
import { body } from "express-validator";
import { isLogin } from "../middlewares/passwordJWT";
import { isAdmin } from "../middlewares/checkAdmin";

router.get("/", getcategory);
router.get("/:category", getbycategory);
router.post(
  "/",
  [
    isLogin,
    isAdmin,
    body("name").not().isEmpty().withMessage("Name cannot be empty."),
  ],
  addcategory
);
router.put("/:id", [isLogin, isAdmin], updatecategory);
router.delete("/:id", [isLogin, isAdmin], deletecategory);

export default router;
