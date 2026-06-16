const express = require("express");
const cors = require("cors");
const reminderRoutes = require("./routes/reminderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");

require("./config/db");

const customerRoutes = require("./routes/customerRoutes");
const occasionRoutes = require("./routes/occasionRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/occasions", occasionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/suggestions", suggestionRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});