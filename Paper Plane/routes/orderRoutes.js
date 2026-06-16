const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrdersByCustomer
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/customer/:customerId", getOrdersByCustomer);

module.exports = router;