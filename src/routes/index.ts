import { Router } from "express";
const router = Router();

router.get("/", function (req, res, next) {
  return res
    .status(200)
    .json({ message: "Uniq Kids! Kids clothes store", alert: undefined });
});

export default router;
