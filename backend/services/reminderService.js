const db = require("../config/db");

const getUpcomingOccasions = (req, res) => {
    const sql = `
        SELECT
            customers.name,
            customers.email,
            occasions.occasion_name,
            occasions.occasion_date
        FROM occasions
        JOIN customers
        ON occasions.customer_id = customers.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
};

module.exports = {
    getUpcomingOccasions
};