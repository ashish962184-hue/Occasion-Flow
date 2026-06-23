const db = require('../config/db');

const query = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, [], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const getReports = async (req, res) => {
  try {
    const totalCustomersRes = await query('SELECT COUNT(*) AS "totalCustomers" FROM customers');
    const vipRes = await query("SELECT COUNT(*) AS count FROM customers WHERE customertype = 'VIP'");
    const standardRes = await query("SELECT COUNT(*) AS count FROM customers WHERE customertype = 'Standard'");

    const upcomingOccasionsRes = await query("SELECT COUNT(*) AS count FROM occasions WHERE status = 'Upcoming'");

    const purchaseRes = await query('SELECT COUNT(*) AS "totalPurchases", COALESCE(SUM(amount), 0) AS "totalRevenue" FROM orders');

    const remindersRes = await query("SELECT COUNT(*) AS count FROM reminders WHERE status = 'Pending'");

    res.json({
      success: true,
      data: {
        customerSummary: {
          totalCustomers: parseInt(totalCustomersRes[0].totalCustomers, 10) || 0,
          vipCount: parseInt(vipRes[0].count, 10) || 0,
          standardCount: parseInt(standardRes[0].count, 10) || 0
        },
        occasionSummary: {
          totalOccasions: parseInt(upcomingOccasionsRes[0].count, 10) || 0
        },
        purchaseSummary: {
          totalPurchases: parseInt(purchaseRes[0].totalPurchases, 10) || 0,
          totalRevenue: parseFloat(purchaseRes[0].totalRevenue) || 0
        },
        reminderSummary: {
          totalReminders: parseInt(remindersRes[0].count, 10) || 0
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch reports' });
  }
};

module.exports = { getReports };
