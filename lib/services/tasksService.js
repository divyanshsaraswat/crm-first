const { pool } = require('../db/sqlConfig');
const { hashPassword, comparePassword } = require('../services/utilities/passwordhash');
const { generateToken } = require('../services/utilities/jwtsign');
const { Parser } = require('json2csv');

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

exports.getOpps = async () => {
  const [rows] = await pool.query('SELECT * FROM Opportunities;');
  return [rows];
};

exports.getOppById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM Opportunities WHERE id = ?', [id]);
  return rows[0];
};

exports.deleteOpp = async (id) => {
  const [result] = await pool.query('DELETE FROM Opportunities WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.insertOpp = async (account) => {
  const { name, amount, stage, close_date, account_id, contact_id, pid } = account;
  const [result] = await pool.query(
    'INSERT INTO Opportunities (name, amount, stage, close_date, account_id, contact_id, assigned_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, amount || '', stage, close_date || '', account_id, contact_id, pid]
  );
  return result.affectedRows;
};

exports.updateTaskbyId = async (id) => {
  try {
    const [result] = await pool.query(
      "UPDATE TASKS SET STATUS = '433B48B5-7D5E-46AB-A1A8-AF8A06D5AFB6' WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

exports.getTasks = async (data) => {
  const [rows] = await pool.query(
    `SELECT 
      u.id,
      u.subject,
      u.body,
      v.statustype AS status,
      u.due_date,
      u.status AS status_id,
      u.contact_id,
      u.created_at,
      u.assigned_user_id AS assigned_user_id,
      w.username AS assigned_user,
      x.username AS created_by,
      u.updated_at
    FROM Tasks u
    JOIN Statusmaster v ON u.status = v.id
    JOIN Users w ON u.assigned_user_id = w.id
    JOIN Users x ON u.created_by = x.id
    WHERE u.assigned_user_id = ?`,
    [data?.pid]
  );
  return [rows];
};

exports.getTasksAll = async (data) => {
  const [rows] = await pool.query(
    `SELECT 
      u.id,
      u.subject,
      u.body,
      v.statustype AS status,
      u.due_date,
      u.status AS status_id,
      u.contact_id,
      u.created_at,
      u.assigned_user_id AS assigned_user_id,
      w.username AS assigned_user,
      x.username AS created_by,
      u.updated_at
    FROM Tasks u
    JOIN Statusmaster v ON u.status = v.id
    JOIN Users w ON u.assigned_user_id = w.id
    JOIN Users x ON u.created_by = x.id
    WHERE created_by = ? OR assigned_user_id = ?`,
    [data?.pid, data?.pid]
  );
  return [rows];
};

exports.downloadCSV = async (data) => {
  const json2csv = new Parser();
  const idList = data.records.map(() => '?').join(',');
  const values = data.records;
  const [rows] = await pool.query(
    `SELECT u.id, subject, body, v.statustype AS status, due_date, contact_id, created_at, assigned_user_id, created_by, updated_at
     FROM Tasks u
     JOIN Statusmaster v ON u.status = v.id
     WHERE u.id IN (${idList})`,
    values
  );
  const csv = json2csv.parse(rows);
  return csv;
};

exports.getTaskById = async (id) => {
  const [rows] = await pool.query(
    `SELECT 
      u.id,
      u.subject,
      u.body,
      v.statustype AS status,
      u.due_date,
      u.status AS status_id,
      u.contact_id,
      u.created_at,
      u.assigned_user_id AS assigned_user_id,
      w.username AS assigned_user,
      x.username AS created_by,
      u.updated_at
    FROM Tasks u
    JOIN Statusmaster v ON u.status = v.id
    JOIN Users w ON u.assigned_user_id = w.id
    JOIN Users x ON u.created_by = x.id
    WHERE contact_id = ?`,
    [id]
  );
  return [rows];
};

exports.deleteTask = async (id) => {
  const [result] = await pool.query('DELETE FROM Tasks WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.insertTask = async (account) => {
  const { subject, body, status, due_date, contact_id, assigned_user_id, pid } = account;
  try {
    const [result] = await pool.query(
      'INSERT INTO Tasks (subject, body, status, due_date, contact_id, assigned_user_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [subject, body || '', status, due_date || '', contact_id, assigned_user_id, pid]
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Error inserting task:', error);
    throw error;
  }
};

exports.updateTask = async (account) => {
  const { id, subject, body, status, due_date, assigned_user_id } = account;
  try {
    const [result] = await pool.query(
      'UPDATE Tasks SET subject = ?, body = ?, status = ?, due_date = ?, assigned_user_id = ?, updated_at = NOW() WHERE id = ?',
      [subject, body || '', status, due_date || '', assigned_user_id, id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};
