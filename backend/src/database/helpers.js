
 // Parameter binding uses named placeholders (:name) to match the SQL style
 // used throughout the services layer.
 

const { getDb, persist } = require('./index');

/**
 * @param {string} sql    - SQL string with :name placeholders
 * @param {object} params - { ':name': value, … }
 * @returns {Array<object>}
 */
function queryAll(sql, params = {}) {
  const db     = getDb();
  const stmt   = db.prepare(sql);
  const rows   = [];

  stmt.bind(params);
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * Execute a SELECT and return the FIRST matching row, or null.
 *
 * @param {string} sql
 * @param {object} params
 * @returns {object|null}
 */
function queryOne(sql, params = {}) {
  const rows = queryAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute an INSERT / UPDATE / DELETE statement, then flush to disk.
 *
 * @param {string} sql
 * @param {object} params
 */
function run(sql, params = {}) {
  const db = getDb();
  db.run(sql, params);
  persist();   // keep the file on disk in sync
}

module.exports = { queryAll, queryOne, run };
