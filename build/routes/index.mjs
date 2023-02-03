import express from "express";
const router = express.Router();
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});
var routes_default = router;
export {
  routes_default as default
};
