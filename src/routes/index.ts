import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.status(200).json({ message: "Hello!", alert: "" });
});

export default router;
