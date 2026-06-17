const db = require("../config/db");

const createCustomer = (req, res) => {
  const { name, email, phone } = req.body;

  const sql = "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)";

  db.query(sql, [name, email, phone], (err, result) => {
   if (err) {
    if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    return res.status(500).json(err);
}

    res.status(201).json({
      message: "Customer created successfully",
      id: result.insertId,
    });
  });
};

const getCustomers = (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      return res.status(500).json(err);
    }

    res.json(results);
  });
};

const deleteCustomer = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM customers WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: "Customer deleted successfully" });
  });
};

const getCustomerById = async (req, res) => {
  const { id } = req.params;

  const query = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });

  try {
    const customers = await query("SELECT * FROM customers WHERE id = ?", [id]);
    if (customers.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customer = customers[0];

    // Fetch related data
    const occasions = await query("SELECT id, occasion_name as occasion_type, occasion_date, reminder_days_before as reminder_days, status FROM occasions WHERE customer_id = ?", [id]);
    const purchase_history = await query("SELECT id, gift_name as gift_item, amount, order_date FROM orders WHERE customer_id = ?", [id]);
    const reminders = await query("SELECT * FROM reminders WHERE customer_id = ?", [id]);
    const workflow_history = await query("SELECT * FROM workflow_history WHERE customer_id = ?", [id]);

    customer.occasions = occasions;
    customer.purchase_history = purchase_history;
    customer.reminders = reminders;
    customer.workflow_history = workflow_history;
    
    // Parse preferences if it exists, else empty array
    customer.preferences = customer.preferences ? JSON.parse(customer.preferences) : [];

    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  deleteCustomer,
  getCustomerById,
};
