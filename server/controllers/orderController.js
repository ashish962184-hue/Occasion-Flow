const db = require("../config/db");

// Create Order
const createOrder = (req, res) => {
    const { customer_id, gift_item, amount, order_date } = req.body;

    const sql = `
        INSERT INTO orders
        (customer_id, gift_name, amount, order_date)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [customer_id, gift_item, amount, order_date],
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
        `SELECT orders.*, customers.name AS customer_name, orders.gift_name AS gift_item 
         FROM orders 
         LEFT JOIN customers ON orders.customer_id = customers.id`,
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
        `SELECT orders.*, customers.name AS customer_name, orders.gift_name AS gift_item 
         FROM orders 
         LEFT JOIN customers ON orders.customer_id = customers.id 
         WHERE orders.customer_id = ?`,
        [customerId],
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);
        }
    );
};

// Delete Order
const deleteOrder = (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM orders WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Order not found" });
            }
            res.json({ message: "Order deleted successfully" });
        }
    );
};

module.exports = {
    createOrder,
    getOrders,
    getOrdersByCustomer,
    deleteOrder
};