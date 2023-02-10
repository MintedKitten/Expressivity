import express from "express";
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  return res.status(200).json({ data: "users!" });
});

export default router;
