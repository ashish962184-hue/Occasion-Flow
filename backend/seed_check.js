const db = require('./config/db');

async function checkAndSeed() {
  db.query('SELECT COUNT(*) as count FROM customers', [], (err, rows) => {
    if (err) {
      console.error("Error checking DB:", err);
      process.exit(1);
    }
    const count = rows[0].count;
    if (count === 0) {
      console.log("Database empty. Seeding...");
      // Seed Customers
      const customers = [
        ["Alice Vanderbilt", "alice@example.com", "555-0101", "VIP"],
        ["Bob Sterling", "bob@example.com", "555-0102", "Standard"],
        ["Charlie Astor", "charlie@example.com", "555-0103", "VIP"],
        ["Diana Prince", "diana@example.com", "555-0104", "Standard"],
        ["Edward Forbes", "edward@example.com", "555-0105", "VIP"]
      ];
      customers.forEach(c => {
        db.query("INSERT INTO customers (name, email, phone, customerType) VALUES (?, ?, ?, ?)", c);
      });

      // Seed Occasions
      const occasions = [
        [1, "Birthday", "2026-07-15", 7],
        [2, "Anniversary", "2026-08-20", 14],
        [3, "Custom", "2026-09-10", 3]
      ];
      occasions.forEach(o => {
        db.query("INSERT INTO occasions (customer_id, occasion_type, occasion_date, reminder_days) VALUES (?, ?, ?, ?)", o);
      });

      // Seed Purchases
      const purchases = [
        [1, "Diamond Necklace", 15000, "2026-05-01"],
        [1, "Rolex Watch", 12000, "2026-05-15"],
        [3, "Vintage Wine Set", 3000, "2026-06-01"]
      ];
      purchases.forEach(p => {
        db.query("INSERT INTO orders (customer_id, gift_item, amount, order_date) VALUES (?, ?, ?, ?)", p);
      });

      // Seed Reminders
      const reminders = [
        [1, "Birthday coming up", "2026-07-08"],
        [2, "Anniversary coming up", "2026-08-06"],
        [3, "Custom event reminder", "2026-09-07"]
      ];
      reminders.forEach(r => {
        db.query("INSERT INTO reminders (customer_id, message, due_date) VALUES (?, ?, ?)", r);
      });

      console.log("Seeding complete.");
    } else {
      console.log("Database already contains data. No seeding needed.");
    }
  });
}

checkAndSeed();
