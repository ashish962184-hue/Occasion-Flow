const express = require("express");
const router = express.Router();

const {
    getGiftSuggestions
} = require("../controllers/suggestionController");

router.get("/:customerId", getGiftSuggestions);

module.exports = router;