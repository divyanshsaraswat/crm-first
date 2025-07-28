const { pool } = require('../db/sqlConfig');
const { hashPassword, comparePassword } = require('../services/utilities/passwordhash');
const { generateToken } = require('../services/utilities/jwtsign');
const { Parser } = require('json2csv');

exports.getContacts = async (data) => {
  const { pid, role } = data;
  let result;

  if (role === 'admin') {
    const [rows] = await pool.query('SELECT * FROM Contacts;');
    result = [rows];
  } else if (role === 'user' || role === 'manager') {
    const [rows] = await pool.query(
      'SELECT u.* FROM Contacts u INNER JOIN Contacts p ON u.contact_owner_id = p.contact_owner_id WHERE p.id = ?',
      [pid]
    );
    result = [rows];
  }
  return result;
};

exports.getContactById = async (id) => {
  const [rows] = await pool.query(
    'SELECT u.* FROM Contacts u INNER JOIN Contacts p ON u.contact_owner_id = p.contact_owner_id WHERE u.id = ?',
    [id]
  );
  return rows[0];
};

exports.insertContact = async (contact) => {
  const { first_name, last_name, email, phone, account_id, pid } = contact;
  const [result] = await pool.query(
    'INSERT INTO Contacts (first_name, last_name, email, phone, account_id, contact_owner_id) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name || '', last_name, email || '', phone || '', account_id, pid]
  );
  return result.affectedRows;
};

exports.updateById = async (data) => {
  const { id, first_name, last_name, email, phone, account_id } = data;
  const [result] = await pool.query(
    'UPDATE Contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, account_id = ? WHERE id = ?',
    [first_name, last_name, email, phone, account_id, id]
  );
  return result.affectedRows;
};

exports.deleteContact = async (id) => {
  const [result] = await pool.query('DELETE FROM Contacts WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.downloadCSV = async (data) => {
  const json2csv = new Parser();
  const idList = data.map(() => '?').join(',');
  const [rows] = await pool.query(`SELECT * FROM Contacts WHERE id IN (${idList})`, data);
  const csv = json2csv.parse(rows);
  return csv;
};
