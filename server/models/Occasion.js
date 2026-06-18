const db = require("../config/db");

class Occasion {
  static create(data, callback) {
    const sql = `
      INSERT INTO occasions
      (customer_id, occasion_name, occasion_date, reminder_days_before, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        data.customer_id,
        data.occasion_type, // Frontend sends occasion_type
        data.occasion_date,
        data.reminder_days, // Frontend sends reminder_days
        data.status || 'Upcoming' // Frontend sends status
      ],
      callback
    );
  }

  static getAll(callback) {
    const sql = `
      SELECT o.id, o.customer_id, o.occasion_name as occasion_type, 
             o.occasion_date, o.reminder_days_before as reminder_days, 
             o.status, c.name as customer_name
      FROM occasions o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.occasion_date ASC
    `;
    db.query(sql, callback);
  }

  static update(id, data, callback) {
    const sql = `
      UPDATE occasions
      SET customer_id = ?, occasion_name = ?, occasion_date = ?, reminder_days_before = ?, status = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        data.customer_id,
        data.occasion_type,
        data.occasion_date,
        data.reminder_days,
        data.status,
        id
      ],
      callback
    );
  }

  static delete(id, callback) {
    // Delete associated reminders first, then occasion
    db.query("DELETE FROM reminders WHERE occasion_id = ?", [id], (err) => {
      if (err) return callback(err);
      db.query("DELETE FROM occasions WHERE id = ?", [id], callback);
    });
  }
}

module.exports = Occasion;