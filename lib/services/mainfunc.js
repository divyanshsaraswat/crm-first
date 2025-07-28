const fs = require('fs');
const path = require('path');
const { pool } = require('../db/sqlConfig');

exports.runSQL = async () => {
  try {
    const filePath = path.join(__dirname, '..', 'db', 'init.sql');
    console.log('Reading file from:', filePath);

    const initSql = fs.readFileSync(filePath, 'utf-8');

    console.log('Connected to DB, running query...');
    await pool.query(initSql);

    return { message: 'SQL script executed successfully' };
  } catch (err) {
    console.error('Error inside runSQL:', err);
    throw err;
  }
};
