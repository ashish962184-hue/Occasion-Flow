const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const fs = require('fs');
let dbPath = path.join(__dirname, '../database/database.sqlite');

// Vercel serverless environment is read-only except for /tmp
if (process.env.NODE_ENV === 'production') {
  const tmpPath = '/tmp/database.sqlite';
  if (!fs.existsSync(tmpPath) && fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, tmpPath);
  }
  dbPath = tmpPath;
}

const sqliteDb = new sqlite3.Database(dbPath);

sqliteDb.run("PRAGMA foreign_keys = ON;");

const connection = {
  query: function(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('SHOW');
    if (isSelect) {
      sqliteDb.all(sql, params, (err, rows) => {
        if (callback) callback(err, rows);
      });
    } else {
      sqliteDb.run(sql, params, function(err) {
        if (callback) callback(err, { insertId: this.lastID, affectedRows: this.changes });
      });
    }
  },
  connect: function(callback) {
    console.log("SQLite Connected");
    if (callback) callback(null);
  }
};

module.exports = connection;