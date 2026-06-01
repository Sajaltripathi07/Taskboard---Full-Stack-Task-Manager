
const path = require('path');
const fs   = require('fs');
const initSqlJs = require('sql.js');

// Path where the binary database file lives.
const DB_PATH = path.resolve(__dirname, '../../data/taskmanager.db');

let db  = null;
let SQL = null;


function persist() {
  if (!db) return;
  const data = db.export();           // Uint8Array
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}


async function initDatabase() {
  if (db) return db;          // already initialised 

  
  const sqlJsDistDir = path.dirname(require.resolve('sql.js/dist/sql-wasm.js'));
  SQL = await initSqlJs({
    locateFile: (file) => path.join(sqlJsDistDir, file),
  });

  // Ensure the data directory exists.
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Load existing file, or create a fresh database.
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log(' Database loaded from', DB_PATH);
  } else {
    db = new SQL.Database();
    console.log(' New database created at', DB_PATH);
  }

  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schema     = fs.readFileSync(schemaPath, 'utf8');
  db.run(schema);
  persist();   // flush schema changes immediately

  console.log(' Schema applied successfully');
  return db;
}


function getDb() {
  if (!db) throw new Error('Database not initialised. Call initDatabase() first.');
  return db;
}

module.exports = { initDatabase, getDb, persist };
