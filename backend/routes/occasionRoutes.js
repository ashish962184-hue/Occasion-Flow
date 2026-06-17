const express = require("express");
const router = express.Router();

const {
  createOccasion,
  getOccasions,
  updateOccasion
} = require("../controllers/occasionController");

router.post("/", createOccasion);
router.get("/", getOccasions);
router.put("/:id", updateOccasion);

module.exports = router;