const db = require("../config/db");

class Occasion {
  static create(data, callback) {
    const sql = `
      INSERT INTO occasions
      (customer_id, occasion_name, occasion_date, reminder_days_before)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        data.customer_id,
        data.occasion_name,
        data.occasion_date,
        data.reminder_days_before,
      ],
      callback
    );
  }

  static getAll(callback) {
    db.query("SELECT * FROM occasions", callback);
  }
}

module.exports = Occasion;