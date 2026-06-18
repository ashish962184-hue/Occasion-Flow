const db = require("../config/db");

// Create Order
const createOrder = (req, res) => {
    const { customer_id, gift_name, amount, order_date } = req.body;

    const sql = `
        INSERT INTO orders
        (customer_id, gift_name, amount, order_date)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [customer_id, gift_name, amount, order_date],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Order created successfully",
                id: result.insertId
            });
        }
    );
};

// Get All Orders
const getOrders = (req, res) => {
    db.query(
        "SELECT * FROM orders",
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
};

// Get Orders By Customer
const getOrdersByCustomer = (req, res) => {
    const customerId = req.params.customerId;

    db.query(
        "SELECT * FROM orders WHERE customer_id = ?",
        [customerId],
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
};

module.exports = {
    createOrder,
    getOrders,
    getOrdersByCustomer
};