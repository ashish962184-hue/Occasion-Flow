import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, getClient } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../src/db/alexandria_db.json');

async function migrate() {
  console.log('Starting migration...');
  
  // Read schema
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
  
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    // 1. Create tables
    console.log('Creating tables...');
    await client.query(schemaSql);
    
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      console.log('Found existing JSON data. Migrating...');

      // Owners
      if (data.owners && data.owners.length > 0) {
        for (const owner of data.owners) {
          await client.query(
            'INSERT INTO owners (id, name, email, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
            [owner.id, owner.name, owner.email, new Date(owner.createdAt || Date.now())]
          );
        }
      }

      // Customers
      if (data.customers && data.customers.length > 0) {
        for (const c of data.customers) {
          await client.query(
            'INSERT INTO customers (id, name, email, phone, customer_type, annual_budget, notes, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING',
            [c.id, c.name, c.email, c.phone, c.customerType, c.annualBudget, c.notes, new Date(c.createdAt || Date.now()), new Date(c.updatedAt || Date.now())]
          );
        }
      }

      // Customer Preferences
      if (data.customer_preferences && data.customer_preferences.length > 0) {
        for (const p of data.customer_preferences) {
          await client.query(
            'INSERT INTO customer_preferences (id, customer_id, preference_type, preference_value, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
            [p.id, p.customerId, p.preferenceType, p.preferenceValue, new Date(p.createdAt || Date.now())]
          );
        }
      }

      // Occasions
      if (data.occasions && data.occasions.length > 0) {
        for (const o of data.occasions) {
          await client.query(
            'INSERT INTO occasions (id, customer_id, type, date, reminder_days, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING',
            [o.id, o.customerId, o.type, o.date, o.reminderDays, o.status, new Date(o.createdAt || Date.now()), new Date(o.updatedAt || Date.now())]
          );
        }
      }

      // Purchase History
      if (data.purchase_history && data.purchase_history.length > 0) {
        for (const p of data.purchase_history) {
          await client.query(
            'INSERT INTO purchase_history (id, customer_id, item, amount, order_date, notes, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
            [p.id, p.customerId, p.item, p.amount, p.orderDate, p.notes, new Date(p.createdAt || Date.now())]
          );
        }
      }

      // Reminders
      if (data.reminders && data.reminders.length > 0) {
        for (const r of data.reminders) {
          await client.query(
            'INSERT INTO reminders (id, customer_id, occasion_id, date, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
            [r.id, r.customerId, r.occasionId, r.date, r.status, new Date(r.createdAt || Date.now()), new Date(r.updatedAt || Date.now())]
          );
        }
      }

      // Workflow History
      if (data.workflow_history && data.workflow_history.length > 0) {
        for (const w of data.workflow_history) {
          await client.query(
            'INSERT INTO workflow_history (id, customer_id, status, notes, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
            [w.id, w.customerId, w.status, w.notes, new Date(w.createdAt || Date.now())]
          );
        }
      }
    }
    
    await client.query('COMMIT');
    console.log('Migration completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();
