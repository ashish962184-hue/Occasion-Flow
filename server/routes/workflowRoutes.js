const express = require("express");
const router = express.Router();
const { updateWorkflowStatus } = require("../controllers/workflowController");

router.put("/status", updateWorkflowStatus);

module.exports = router;
