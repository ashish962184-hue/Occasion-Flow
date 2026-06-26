const db = require("../config/db");

const getReminders = (req, res) => {
    const sql = `
        SELECT
            r.id,
            r.customer_id,
            c.name AS customer_name,
            o.occasion_name,
            r.scheduled_date,
            r.status
        FROM reminders r
        LEFT JOIN customers c ON r.customer_id = c.id
        LEFT JOIN occasions o ON r.occasion_id = o.id
        ORDER BY r.scheduled_date ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(results);
    });
};

const updateReminder = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE reminders SET status = ? WHERE id = ?", [status, id], (err) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Reminder updated successfully" });
    });
};

module.exports = {
    getReminders,
    updateReminder
};