const { Pool } = require('pg');

const connectionString = (process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING).split('?')[0];
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const connection = {
  query: function(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    
    // SQLite uses ?, Postgres uses $1, $2, etc.
    let pgSql = sql;
    let i = 1;
    pgSql = pgSql.replace(/\?/g, () => `$${i++}`);

    // SQLite auto-increments don't return the ID by default, but Postgres needs RETURNING id
    const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING');
    if (isInsert) {
      pgSql += ' RETURNING id';
    }

    // Ignore SQLite specific PRAGMA commands
    if (pgSql.trim().toUpperCase().startsWith('PRAGMA')) {
      if (callback) callback(null, []);
      return;
    }

    pool.query(pgSql, params, (err, res) => {
      if (err) {
        console.error("PG Query Error:", err, pgSql, params);
        if (callback) callback(err, null);
        return;
      }
      
      const isSelect = pgSql.trim().toUpperCase().startsWith('SELECT') || pgSql.trim().toUpperCase().startsWith('SHOW');
      if (isSelect) {
        if (callback) callback(null, res.rows);
      } else {
        // Postgres returns insert id in rows[0].id if RETURNING was used
        let insertId = null;
        if (res.rows && res.rows.length > 0) {
          insertId = res.rows[0].id || res.rows[0].customer_id || res.rows[0].occasion_id || null;
        }
        if (callback) callback(null, { insertId: insertId, affectedRows: res.rowCount });
      }
    });
  },
  connect: function(callback) {
    console.log("Postgres Pool initialized");
    if (callback) callback(null);
  }
};

module.exports = connection;