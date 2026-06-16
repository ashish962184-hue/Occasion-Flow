const db = require("../config/db");

const getDashboardStats = (req, res) => {

    const dashboard = {};

    db.query(
        "SELECT COUNT(*) AS totalCustomers FROM customers",
        (err, customerResult) => {

            if (err) return res.status(500).json(err);

            dashboard.totalCustomers =
                customerResult[0].totalCustomers;

            db.query(
                "SELECT COUNT(*) AS totalOccasions FROM occasions",
                (err, occasionResult) => {

                    if (err) return res.status(500).json(err);

                    dashboard.totalOccasions =
                        occasionResult[0].totalOccasions;

                    db.query(
                        "SELECT COUNT(*) AS totalOrders FROM orders",
                        (err, orderResult) => {

                            if (err) return res.status(500).json(err);

                            dashboard.totalOrders =
                                orderResult[0].totalOrders;

                            res.json(dashboard);
                        }
                    );
                }
            );
        }
    );
};

module.exports = {
    getDashboardStats
};