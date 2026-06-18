const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const schemaPath = path.join(__dirname, 'schema.sql');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Let's replace MySQL specific syntax with SQLite syntax
schema = schema.replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');
schema = schema.replace(/INT AUTOINCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');
schema = schema.replace(/UNIQUE KEY idx_unique_name_phone \(name, phone\)/gi, 'UNIQUE(name, phone)');
// Remove Database creation commands which are MySQL specific
schema = schema.replace(/CREATE DATABASE IF NOT EXISTS giftingcrm;/gi, '');
schema = schema.replace(/USE giftingcrm;/gi, '');

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");
  
  // Split statements and run them
  const statements = schema.split(';').filter(stmt => stmt.trim() !== '');
  statements.forEach(stmt => {
    db.run(stmt + ';', (err) => {
      if (err) console.error("Error executing statement:", stmt, err);
    });
  });
});

db.close(() => {
  console.log("SQLite Database initialized at", dbPath);
});
