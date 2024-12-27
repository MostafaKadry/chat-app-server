const express = require("express");
const router = express.Router();
const cors = require("cors");
// express().use(cors());

router.get("/", (req, res) => {
  res.send(`server is running good in router file`);
});
module.exports = router;
