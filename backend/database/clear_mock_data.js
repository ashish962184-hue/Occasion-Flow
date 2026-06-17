const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("DELETE FROM occasions WHERE customer_id IN (SELECT id FROM customers WHERE name LIKE '%[MOCK]')");
  db.run("DELETE FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE name LIKE '%[MOCK]')");
  db.run("DELETE FROM reminders WHERE customer_id IN (SELECT id FROM customers WHERE name LIKE '%[MOCK]')");
  db.run("DELETE FROM workflow_history WHERE customer_id IN (SELECT id FROM customers WHERE name LIKE '%[MOCK]')");
  db.run("DELETE FROM customers WHERE name LIKE '%[MOCK]'", function(err) {
    if (err) {
      console.error("Error clearing mock data:", err);
    } else {
      console.log(`Cleared ${this.changes} mock customers and all their associated records (occasions, orders, etc).`);
    }
  });
});

db.close();
