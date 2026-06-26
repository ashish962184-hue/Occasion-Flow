const express = require("express");
const router = express.Router();

const {
    getReminders,
    updateReminder
} = require("../services/reminderService");

router.get("/", getReminders);
router.put("/:id", updateReminder);

module.exports = router;