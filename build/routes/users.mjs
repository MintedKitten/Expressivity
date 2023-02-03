import express from "express";
var router = express.Router();
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});
var users_default = router;
export {
  users_default as default
};
