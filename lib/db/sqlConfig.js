const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port:1433,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
    encrypt:false,
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool
  })
  .catch(err => {
  console.error('Database Connection Failed! Bad Config:', err);
  console.error('Error Details:', err);  // This will log all the error details
  console.error('Error Stack:', err.stack);  // This will log the full error stack
});

module.exports = {
  sql, poolPromise
};