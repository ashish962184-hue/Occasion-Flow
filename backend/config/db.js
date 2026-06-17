const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const fs = require('fs');
let sqliteDb;
try {
  let dbPath = path.join(__dirname, '../database/database.sqlite');
  
  if (process.env.NODE_ENV === 'production') {
    const tmpPath = '/tmp/database.sqlite';
    try {
      if (!fs.existsSync(tmpPath)) {
        if (fs.existsSync(dbPath)) {
          fs.copyFileSync(dbPath, tmpPath);
        } else {
          console.warn("Source database not found at", dbPath);
          // Try alternative path
          const altPath = path.join(process.cwd(), 'database', 'database.sqlite');
          if (fs.existsSync(altPath)) fs.copyFileSync(altPath, tmpPath);
        }
      }
    } catch (err) {
      console.error("Error copying DB:", err);
    }
    dbPath = tmpPath;
  }
  
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Database connection error:", err.message);
  });
  
  sqliteDb.on('error', err => console.error("SQLite Error:", err));
  sqliteDb.run("PRAGMA foreign_keys = ON;", (err) => {
    if (err) console.error("Pragma error:", err);
  });
} catch (err) {
  console.error("Fatal SQLite init error:", err);
  // Fallback to in-memory so it doesn't crash the lambda completely
  sqliteDb = new sqlite3.Database(':memory:');
}

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