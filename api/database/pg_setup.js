require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL).split('?')[0];
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const schemaPath = path.join(__dirname, 'schema.sql');
let schema = fs.readFileSync(schemaPath, 'utf8');

async function setupDatabase() {
  try {
    console.log("Dropping old tables...");
    await pool.query("DROP TABLE IF EXISTS workflow_history CASCADE;");
    await pool.query("DROP TABLE IF EXISTS workflow CASCADE;");
    await pool.query("DROP TABLE IF EXISTS reminders CASCADE;");
    await pool.query("DROP TABLE IF EXISTS orders CASCADE;");
    await pool.query("DROP TABLE IF EXISTS purchase_history CASCADE;");
    await pool.query("DROP TABLE IF EXISTS occasions CASCADE;");
    await pool.query("DROP TABLE IF EXISTS customers CASCADE;");
    await pool.query("DROP TABLE IF EXISTS migration_history CASCADE;");
    
    const statements = schema.split(';').filter(stmt => stmt.trim() !== '');
    for (const stmt of statements) {
      console.log(`Executing: ${stmt.substring(0, 50)}...`);
      await pool.query(stmt);
    }
    console.log("Postgres Database initialized successfully.");
  } catch (err) {
    console.error("Error executing schema:", err);
  } finally {
    pool.end();
  }
}

setupDatabase();
