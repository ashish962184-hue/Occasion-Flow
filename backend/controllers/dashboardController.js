const db = require("../config/db");

const getDashboardStats = (req, res) => {
    db.query(
        "SELECT COUNT(*) AS totalCustomers FROM customers",
        (err, customerResult) => {
            if (err) return res.status(500).json(err);
            
            db.query(
                "SELECT COUNT(*) AS totalOrders FROM orders",
                (err, orderResult) => {
                    if (err) return res.status(500).json(err);

                    res.json({
                        totalCustomers: customerResult[0].totalCustomers || 0,
                        upcomingOccasions: [],
                        pendingFollowUps: 0,
                        reminderQueue: [],
                        repeatOpportunities: orderResult[0].totalOrders || 0
                    });
                }
            );
        }
    );
};

module.exports = {
    getDashboardStats
};