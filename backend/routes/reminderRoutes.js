const express = require("express");
const router = express.Router();

const {
    getUpcomingOccasions
} = require("../services/reminderService");

router.get("/", getUpcomingOccasions);

module.exports = router;