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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});