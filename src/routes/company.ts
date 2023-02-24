import { Router } from "express";
const router = Router();
import {
  showall,
  showone,
  insert,
  update,
  remove,
} from "../controllers/companyController";
import { isAdmin } from "../middlewares/checkAdmin";
import { isLogin } from "../middlewares/passwordJWT";

router.get("/", [isLogin, isAdmin], showall);
router.get("/:id", showone);
router.put("/:id", update);
router.delete("/:id", remove);
router.post("/", insert);

export default router;
