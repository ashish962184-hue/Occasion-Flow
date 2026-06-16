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

module.exports = {
  createCustomer,
  getCustomers,
};
