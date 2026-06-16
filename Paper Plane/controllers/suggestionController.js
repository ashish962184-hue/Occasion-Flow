const db = require("../config/db");

const getGiftSuggestions = (req, res) => {

    const customerId = req.params.customerId;

    const sql = `
        SELECT gift_name,
               COUNT(*) AS purchase_count
        FROM orders
        WHERE customer_id = ?
        GROUP BY gift_name
        ORDER BY purchase_count DESC
        LIMIT 5
    `;

    db.query(sql, [customerId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
};

module.exports = {
    getGiftSuggestions
};