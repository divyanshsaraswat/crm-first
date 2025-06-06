const fs = require('fs');
const path = require('path');
const { poolPromise } = require('../db/sqlConfig');

exports.runSQL = async () => {
  try {
    const filePath = path.join(__dirname, '..', 'db', 'init.sql');
    console.log('Reading file from:', filePath);

    const initSql = fs.readFileSync(filePath).toString();

    const pool = await poolPromise;
    console.log('Connected to DB, running query...');

    await pool.query(initSql);

    pool.end();
    return { message: 'SQL script executed successfully' };
  } catch (err) {
    console.error('Error inside runSQL:', err);
    throw err; 
  }
};

