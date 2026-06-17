const db = require("./db");

function runAutoSeed() {
  db.query("SELECT COUNT(*) as count FROM customers", (err, rows) => {
    if (err) {
      console.error("Auto-seed check failed:", err.message);
      return;
    }
    if (rows && rows[0] && rows[0].count === 0) {
      console.log("Database is empty. Running production auto-seed...");
      
      const customers = [
        { name: 'Alice Smith', email: 'alice@example.com', phone: '555-1001' },
        { name: 'Bob Johnson', email: 'bob@example.com', phone: '555-1002' },
        { name: 'Carol Williams', email: 'carol@example.com', phone: '555-1003' },
        { name: 'David Brown', email: 'david@example.com', phone: '555-1004' },
        { name: 'Eve Davis', email: 'eve@example.com', phone: '555-1005' }
      ];

      customers.forEach((c, index) => {
        db.query("INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)", [c.name, c.email, c.phone], (err, result) => {
          if (!err && result) {
            const customerId = result.insertId;
            
            // Insert 3 Occasions for the first 3 customers
            if (index < 3) {
              const date = new Date();
              date.setDate(date.getDate() + 10);
              db.query("INSERT INTO occasions (customer_id, occasion_name, occasion_date, reminder_days_before, status) VALUES (?, ?, ?, ?, ?)",
                [customerId, 'Birthday', date.toISOString().split('T')[0], 7, 'Upcoming']);
            }

            // Insert 3 Orders (Purchase History)
            if (index < 3) {
              const pastDate = new Date();
              pastDate.setDate(pastDate.getDate() - 20);
              db.query("INSERT INTO orders (customer_id, gift_name, amount, order_date) VALUES (?, ?, ?, ?)",
                [customerId, 'Gift Basket', 150.00, pastDate.toISOString().split('T')[0]]);
            }
          }
        });
      });
      
      console.log("Auto-seed triggered.");
    } else {
      console.log("Database already contains data. Skipping auto-seed.");
    }
  });
}

module.exports = runAutoSeed;
