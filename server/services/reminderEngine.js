const db = require("../config/db");

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const run = async () => {
  console.log("[ReminderEngine] Running automated status check...");
  try {
    const occasions = await query("SELECT * FROM occasions");
    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date(todayStr);

    for (const occ of occasions) {
      if (occ.status === 'Completed') continue;

      const occDateStr = new Date(occ.occasion_date).toISOString().split('T')[0];
      const occDate = new Date(occDateStr);
      let newStatus = occ.status;

      // 1. Check Missed vs Due Today
      if (occDate < today) {
        newStatus = 'Missed';
      } else if (occDate.getTime() === today.getTime()) {
        newStatus = 'Due Today';
      }

      // 2. Reminder logic
      const reminderTriggerDate = new Date(occDate);
      reminderTriggerDate.setDate(reminderTriggerDate.getDate() - occ.reminder_days_before);

      if (today >= reminderTriggerDate && newStatus === 'Upcoming') {
        newStatus = 'Triggered';
      }

      // If status changed, update it
      if (newStatus !== occ.status) {
        await query("UPDATE occasions SET status = ? WHERE id = ?", [newStatus, occ.id]);
        console.log(`[ReminderEngine] Occasion ${occ.id} status updated to ${newStatus}`);
      }

      // 3. Generate Reminder if not exists and we passed the trigger date
      // We only generate a reminder if it's 'Triggered' or 'Due Today'
      if (today >= reminderTriggerDate && occ.status !== 'Completed') {
        // Check if reminder exists
        const reminders = await query("SELECT id FROM reminders WHERE occasion_id = ?", [occ.id]);
        if (reminders.length === 0) {
          await query(
            "INSERT INTO reminders (customer_id, occasion_id, scheduled_date, status) VALUES (?, ?, ?, ?)",
            [occ.customer_id, occ.id, todayStr, 'Pending']
          );
          console.log(`[ReminderEngine] Reminder generated for occasion ${occ.id}`);
        }
      }
    }
    console.log("[ReminderEngine] Finished automated check.");
  } catch (error) {
    console.error("[ReminderEngine] Error during execution:", error);
  }
};

module.exports = {
  run
};
