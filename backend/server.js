import express from 'express';
import cors from 'cors';
import { query } from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper function to calculate reminder date
function generateReminders(occasion) {
  const occasionDate = new Date(occasion.date);
  const reminderDate = new Date(occasionDate);
  reminderDate.setDate(reminderDate.getDate() - (occasion.reminder_days || 14));
  return reminderDate;
}

// Ensure reminder engine logic applies during fetch (dynamic) or via cron.
// Since we generate them on the fly for the prototype:
async function triggerReminders() {
  const TODAY = '2026-06-12'; // From prototype rules
  // Find occasions where today >= date - reminder_days
  // In postgres:
  await query(`
    INSERT INTO reminders (id, customer_id, occasion_id, date, status)
    SELECT gen_random_uuid()::varchar, customer_id, id, (date - (reminder_days || ' days')::interval), 'PENDING'
    FROM occasions
    WHERE $1 >= (date - (reminder_days || ' days')::interval)
    AND NOT EXISTS (SELECT 1 FROM reminders WHERE occasion_id = occasions.id)
  `, [TODAY]);
}

// --- HEALTH ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// --- CUSTOMERS ---
app.get('/api/customers', async (req, res) => {
  try {
    const result = await query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const cust = await query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    if (cust.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    
    const prefs = await query('SELECT * FROM customer_preferences WHERE customer_id = $1', [req.params.id]);
    const customer = cust.rows[0];
    customer.preferences = prefs.rows.reduce((acc, p) => {
      acc[p.preference_type] = p.preference_value;
      return acc;
    }, {});
    
    res.json(customer);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/customers', async (req, res) => {
  try {
    const id = Date.now().toString(); // simple ID gen
    const { name, email, phone, customerType, annualBudget, notes, preferences } = req.body;
    
    await query(
      'INSERT INTO customers (id, name, email, phone, customer_type, annual_budget, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, name, email, phone, customerType, annualBudget, notes]
    );

    if (preferences) {
      for (const [key, value] of Object.entries(preferences)) {
        await query(
          'INSERT INTO customer_preferences (id, customer_id, preference_type, preference_value) VALUES ($1, $2, $3, $4)',
          [Date.now().toString() + Math.random(), id, key, value]
        );
      }
    }
    
    const cust = await query('SELECT * FROM customers WHERE id = $1', [id]);
    res.status(201).json(cust.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { name, email, phone, customerType, annualBudget, notes, preferences } = req.body;
    await query(
      'UPDATE customers SET name=$1, email=$2, phone=$3, customer_type=$4, annual_budget=$5, notes=$6, updated_at=NOW() WHERE id=$7',
      [name, email, phone, customerType, annualBudget, notes, req.params.id]
    );

    if (preferences) {
      // Clear old and insert new (simple sync)
      await query('DELETE FROM customer_preferences WHERE customer_id = $1', [req.params.id]);
      for (const [key, value] of Object.entries(preferences)) {
        await query(
          'INSERT INTO customer_preferences (id, customer_id, preference_type, preference_value) VALUES ($1, $2, $3, $4)',
          [Date.now().toString() + Math.random(), req.params.id, key, value]
        );
      }
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- OCCASIONS ---
app.get('/api/occasions', async (req, res) => {
  try {
    const result = await query(`
      SELECT o.*, c.name as "customerName" 
      FROM occasions o 
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.date ASC
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/occasions', async (req, res) => {
  try {
    const id = Date.now().toString();
    const { customerId, type, date, reminderDays, status } = req.body;
    await query(
      'INSERT INTO occasions (id, customer_id, type, date, reminder_days, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, customerId, type, date, reminderDays || 14, status || 'UPCOMING']
    );
    await triggerReminders();
    res.status(201).json({ id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/occasions/:id', async (req, res) => {
  try {
    const { type, date, reminderDays, status } = req.body;
    await query(
      'UPDATE occasions SET type=$1, date=$2, reminder_days=$3, status=$4, updated_at=NOW() WHERE id=$5',
      [type, date, reminderDays, status, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- PURCHASE HISTORY ---
app.get('/api/purchase-history', async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, c.name as "customerName" 
      FROM purchase_history p 
      LEFT JOIN customers c ON p.customer_id = c.id
      ORDER BY p.order_date DESC
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/purchase-history', async (req, res) => {
  try {
    const id = Date.now().toString();
    const { customerId, item, amount, orderDate, notes } = req.body;
    await query(
      'INSERT INTO purchase_history (id, customer_id, item, amount, order_date, notes) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, customerId, item, amount, orderDate, notes]
    );
    res.status(201).json({ id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- WORKFLOW ---
app.post('/api/workflow/process', async (req, res) => {
  try {
    const { customerId, action, notes } = req.body;
    const id = Date.now().toString();
    await query(
      'INSERT INTO workflow_history (id, customer_id, status, notes) VALUES ($1, $2, $3, $4)',
      [id, customerId, action, notes]
    );
    res.status(201).json({ id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/workflow/status', async (req, res) => {
  try {
    const { reminderId, status, notes } = req.body;
    // Update reminder status
    await query('UPDATE reminders SET status=$1, updated_at=NOW() WHERE id=$2', [status, reminderId]);
    
    // Log workflow
    const r = await query('SELECT customer_id FROM reminders WHERE id=$1', [reminderId]);
    if (r.rows.length > 0) {
      await query(
        'INSERT INTO workflow_history (id, customer_id, status, notes) VALUES ($1, $2, $3, $4)',
        [Date.now().toString(), r.rows[0].customer_id, status, notes]
      );
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/customers/:id/history', async (req, res) => {
  try {
    const result = await query('SELECT * FROM workflow_history WHERE customer_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- REMINDERS ---
app.get('/api/reminders', async (req, res) => {
  try {
    await triggerReminders();
    const result = await query(`
      SELECT r.*, c.name as "customerName", o.type as "occasionType", o.date as "occasionDate"
      FROM reminders r
      JOIN customers c ON r.customer_id = c.id
      JOIN occasions o ON r.occasion_id = o.id
      ORDER BY r.date ASC
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/reminders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await query('UPDATE reminders SET status=$1, updated_at=NOW() WHERE id=$2', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- DASHBOARD ---
app.get('/api/dashboard', async (req, res) => {
  try {
    await triggerReminders();
    const custCount = await query('SELECT COUNT(*) FROM customers');
    const remCount = await query('SELECT COUNT(*) FROM reminders WHERE status = $1', ['PENDING']);
    const repCount = await query('SELECT COUNT(*) FROM workflow_history WHERE status = $1', ['FOLLOW_UP']);
    
    const nextOccasions = await query(`
      SELECT o.*, c.name as "customerName" 
      FROM occasions o JOIN customers c ON o.customer_id = c.id 
      WHERE o.date >= '2026-06-12' AND o.date <= '2026-06-19'
      ORDER BY o.date ASC
    `);

    res.json({
      activeClients: parseInt(custCount.rows[0].count),
      pendingReminders: parseInt(remCount.rows[0].count),
      repeatOpportunities: parseInt(repCount.rows[0].count),
      nextOccasions: nextOccasions.rows
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- REPORTS ---
app.get('/api/reports', async (req, res) => {
  try {
    const totalCustomers = await query('SELECT COUNT(*) FROM customers');
    const totalOccasions = await query('SELECT COUNT(*) FROM occasions');
    const totalPurchases = await query('SELECT COUNT(*) FROM purchase_history');
    
    const rev = await query('SELECT SUM(amount) FROM purchase_history');
    const totalRevenue = rev.rows[0].sum ? parseFloat(rev.rows[0].sum) : 0;
    
    const vip = await query("SELECT COUNT(*) FROM customers WHERE customer_type = 'VIP'");
    const std = await query("SELECT COUNT(*) FROM customers WHERE customer_type = 'Standard'");
    
    const followUpsTotal = await query("SELECT COUNT(*) FROM workflow_history WHERE status = 'FOLLOW_UP'");
    const completedTotal = await query("SELECT COUNT(*) FROM workflow_history WHERE status = 'COMPLETED'");
    const missedTotal = await query("SELECT COUNT(*) FROM workflow_history WHERE status = 'MISSED'");
    
    res.json({
      totalCustomers: parseInt(totalCustomers.rows[0].count),
      totalOccasions: parseInt(totalOccasions.rows[0].count),
      totalPurchases: parseInt(totalPurchases.rows[0].count),
      totalRevenue,
      vipCount: parseInt(vip.rows[0].count),
      standardCount: parseInt(std.rows[0].count),
      monthlyRevenue: {
        'Jan': 4000,
        'Feb': 3000,
        'Mar': 5000,
        'Apr': 7000,
        'May': 6500,
        'Jun': totalRevenue > 0 ? totalRevenue : 8000
      },
      followUpReport: {
        total: parseInt(followUpsTotal.rows[0].count),
        completed: parseInt(completedTotal.rows[0].count),
        pending: parseInt(followUpsTotal.rows[0].count),
        missed: parseInt(missedTotal.rows[0].count)
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] Alexandria CRM Postgres Backend running on http://localhost:${PORT}`);
});
