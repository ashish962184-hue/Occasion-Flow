const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const mockCustomers = [
  { name: 'Elias Thorne [MOCK]', email: 'elias.thorne@example.com', phone: '555-0101' },
  { name: 'Sylvia Vance [MOCK]', email: 'sylvia.vance@example.com', phone: '555-0102' },
  { name: 'Marcus Sterling [MOCK]', email: 'marcus.s@example.com', phone: '555-0103' },
  { name: 'Elena Rostova [MOCK]', email: 'elena.r@example.com', phone: '555-0104' },
  { name: 'Julian Mercer [MOCK]', email: 'j.mercer@example.com', phone: '555-0105' }
];

db.serialize(() => {
  // Clear any existing mock data first to avoid duplicates
  db.run("DELETE FROM occasions WHERE customer_id IN (SELECT id FROM customers WHERE name LIKE '%[MOCK]')");
  db.run("DELETE FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE name LIKE '%[MOCK]')");
  db.run("DELETE FROM customers WHERE name LIKE '%[MOCK]'");

  const stmtCustomer = db.prepare("INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)");
  
  let completed = 0;
  mockCustomers.forEach((c) => {
    stmtCustomer.run([c.name, c.email, c.phone], function(err) {
      if (err) {
        console.error("Error inserting customer:", err);
      } else {
        const customerId = this.lastID;
        
        // Insert occasion
        const stmtOccasion = db.prepare("INSERT INTO occasions (customer_id, occasion_name, occasion_date, reminder_days_before, status) VALUES (?, ?, ?, ?, ?)");
        const today = new Date();
        const futureDate = new Date(today.getTime() + (Math.random() * 55 + 5) * 24 * 60 * 60 * 1000);
        const dateString = futureDate.toISOString().split('T')[0];
        
        const occasionTypes = ['Birthday', 'Anniversary', 'Housewarming', 'Promotion'];
        const occasionName = occasionTypes[Math.floor(Math.random() * occasionTypes.length)];
        
        stmtOccasion.run([customerId, occasionName, dateString, 14, 'Upcoming']);
        stmtOccasion.finalize();
        
        // Insert purchase history
        const stmtOrder = db.prepare("INSERT INTO orders (customer_id, gift_name, amount, order_date) VALUES (?, ?, ?, ?)");
        const pastDate = new Date(today.getTime() - (Math.random() * 100 + 10) * 24 * 60 * 60 * 1000);
        const pastDateString = pastDate.toISOString().split('T')[0];
        
        stmtOrder.run([customerId, 'Vintage Macallan 18yr', 450.00, pastDateString]);
        stmtOrder.finalize();
      }

      completed++;
      if (completed === mockCustomers.length) {
        console.log("Mock data queued! Process will exit when finished.");
      }
    });
  });
});
