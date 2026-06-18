const db = require("../config/db");

const getDashboardStats = (req, res) => {
    db.query(
        'SELECT COUNT(*) AS "totalCustomers" FROM customers',
        (err, customerResult) => {
            if (err) return res.status(500).json(err);
            
            db.query(
                'SELECT COUNT(*) AS "totalOrders" FROM orders',
                (err, orderResult) => {
                    if (err) return res.status(500).json(err);

                    res.json({
                        totalCustomers: parseInt(customerResult[0].totalCustomers, 10) || 0,
                        upcomingOccasions: [],
                        pendingFollowUps: 0,
                        reminderQueue: [],
                        repeatOpportunities: parseInt(orderResult[0].totalOrders, 10) || 0
                    });
                }
            );
        }
    );
};

module.exports = {
    getDashboardStats
};