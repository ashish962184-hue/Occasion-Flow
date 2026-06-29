const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrdersByCustomer,
    deleteOrder
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/customer/:customerId", getOrdersByCustomer);
router.delete("/:id", deleteOrder);

module.exports = router;