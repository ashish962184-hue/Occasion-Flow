require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const connectionString = (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL).split('?')[0];
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const mockCustomers = [
  { name: 'Elias Thorne [MOCK]', email: 'elias.thorne@example.com', phone: '555-0101' },
  { name: 'Sylvia Vance [MOCK]', email: 'sylvia.vance@example.com', phone: '555-0102' },
  { name: 'Marcus Sterling [MOCK]', email: 'marcus.s@example.com', phone: '555-0103' },
  { name: 'Elena Rostova [MOCK]', email: 'elena.r@example.com', phone: '555-0104' },
  { name: 'Julian Mercer [MOCK]', email: 'j.mercer@example.com', phone: '555-0105' }
];

async function seedData() {
  try {
    // Clear any existing mock data first to avoid duplicates
    await pool.query("DELETE FROM occasions WHERE customer_id IN (SELECT id FROM customers WHERE name LIKE '%[MOCK]')");
    await pool.query("DELETE FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE name LIKE '%[MOCK]')");
    await pool.query("DELETE FROM customers WHERE name LIKE '%[MOCK]'");

    for (const c of mockCustomers) {
      const custRes = await pool.query(
        "INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING id",
        [c.name, c.email, c.phone]
      );
      const customerId = custRes.rows[0].id;
      
      const today = new Date();
      const futureDate = new Date(today.getTime() + (Math.random() * 55 + 5) * 24 * 60 * 60 * 1000);
      const dateString = futureDate.toISOString().split('T')[0];
      
      const occasionTypes = ['Birthday', 'Anniversary', 'Housewarming', 'Promotion'];
      const occasionName = occasionTypes[Math.floor(Math.random() * occasionTypes.length)];
      
      await pool.query(
        "INSERT INTO occasions (customer_id, occasion_name, occasion_date, reminder_days_before, status) VALUES ($1, $2, $3, $4, $5)",
        [customerId, occasionName, dateString, 14, 'Upcoming']
      );
      
      const pastDate = new Date(today.getTime() - (Math.random() * 100 + 10) * 24 * 60 * 60 * 1000);
      const pastDateString = pastDate.toISOString().split('T')[0];
      
      await pool.query(
        "INSERT INTO orders (customer_id, gift_name, amount, order_date) VALUES ($1, $2, $3, $4)",
        [customerId, 'Vintage Macallan 18yr', 450.00, pastDateString]
      );
    }
    console.log("Mock data queued and completed!");
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {
    pool.end();
  }
}

seedData();
