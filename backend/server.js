require('dotenv').config();

const { initDatabase } = require('./src/database');
const app = require('./src/app');

const PORT = parseInt(process.env.PORT || '4000', 10);

async function main() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error(' Failed to start server:', err);
    process.exit(1);
  }
}

main();
