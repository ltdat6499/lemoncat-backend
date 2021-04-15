const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.status(500).json({ hihi: true });
});

module.exports = router;
