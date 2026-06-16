const express = require("express");
const router = express.Router();

const {
  createOccasion,
  getOccasions
} = require("../controllers/occasionController");

router.post("/", createOccasion);
router.get("/", getOccasions);

module.exports = router;