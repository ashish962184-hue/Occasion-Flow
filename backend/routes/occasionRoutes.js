const express = require("express");
const router = express.Router();

const {
  createOccasion,
  getOccasions,
  updateOccasion,
  deleteOccasion
} = require("../controllers/occasionController");

router.post("/", createOccasion);
router.get("/", getOccasions);
router.put("/:id", updateOccasion);
router.delete("/:id", deleteOccasion);

module.exports = router;