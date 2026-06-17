const db = require("../config/db");

const updateWorkflowStatus = (req, res) => {
  const { customer_id, status, notes } = req.body;
  if (!customer_id || !status) {
    return res.status(400).json({ message: "customer_id and status required" });
  }

  const sql = "INSERT INTO workflow_history (customer_id, status, notes) VALUES (?, ?, ?)";
  db.query(sql, [customer_id, status, notes], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, message: "Workflow updated" });
  });
};

module.exports = { updateWorkflowStatus };
