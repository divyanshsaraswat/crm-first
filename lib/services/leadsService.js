const { pool } = require('../db/sqlConfig');
const { hashPassword, comparePassword } = require('../services/utilities/passwordhash');
const { generateToken } = require('../services/utilities/jwtsign');

exports.getLeads = async () => {
  const [rows] = await pool.query('SELECT * FROM Leads;');
  return [rows];
};

exports.getLeadById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM Leads WHERE id = ?', [id]);
  return rows[0];
};

exports.deleteLead = async (id) => {
  const [result] = await pool.query('DELETE FROM Leads WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.insertLead = async (account) => {
  const { first_name, last_name, email, status, contacts_user_id, pid } = account;
  const [result] = await pool.query(
    'INSERT INTO Leads (first_name, last_name, email, status, contacts_user_id, assigned_user_id) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name || '', last_name, email || '', status, contacts_user_id || '', pid]
  );
  return result.affectedRows;
};
