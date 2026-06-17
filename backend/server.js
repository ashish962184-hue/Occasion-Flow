const express = require("express");
const cors = require("cors");
const reminderRoutes = require("./routes/reminderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");

const customerRoutes = require("./routes/customerRoutes");
const occasionRoutes = require("./routes/occasionRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const workflowRoutes = require("./routes/workflowRoutes");

require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Strip Vercel's routePrefix if it exists
app.use((req, res, next) => {
  if (req.url.startsWith('/_/backend')) {
    req.url = req.url.replace('/_/backend', '');
  }
  next();
});

// Global DTO Wrapper for API Contracts
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function(data) {
    if (data && data.success !== undefined) {
      return oldJson.call(this, data);
    }
    const isError = res.statusCode >= 400;
    return oldJson.call(this, {
      success: !isError,
      data: isError ? null : data,
      error: isError ? data : null
    });
  };
  next();
});

app.use("/api/customers", customerRoutes);
app.use("/api/occasions", occasionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/purchase-history", orderRoutes); // mapped alias
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/workflow", workflowRoutes);

// Health Check
app.use("/api/health", (req, res) => {
  const db = require("./config/db");
  db.query("SELECT COUNT(*) as count FROM customers", (err, rows) => {
    if (err) return res.status(500).json({ status: "error", database: "disconnected" });
    res.json({ status: "ok", database: "connected", seed_loaded: rows[0].count > 0, customer_count: rows[0].count });
  });
});

// Catch-all for debugging Vercel routing
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", url: req.url, originalUrl: req.originalUrl });
});

// Run Production Seed Strategy if DB is empty
const runAutoSeed = require("./config/auto_seed");
runAutoSeed();

if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

module.exports = app;