const { pool } = require('../db/sqlConfig');
const { hashPassword, comparePassword } = require('../services/utilities/passwordhash');
const { generateToken } = require('../services/utilities/jwtsign');
const { Parser } = require('json2csv');

exports.getAccounts = async (data) => {
  const { pid, role, tenantid } = data;
  let query;
  let params;

  if (role === "admin") {
    query = `SELECT 
      a.id,
      a.name,
      a.website,
      sm.srctype AS source_type,
      a.assigned_user_id,
      a.created_by_id,
      a.updated_at,
      a.Rating,
      a.ContPerson,
      a.Zone,
      a.Address1,
      a.Address2,
      a.City,
      a.StatusID,
      a.DesignationID,
      a.SourceID,
      a.Zip,
      a.States,
      a.Country,
      a.phone,
      a.waphone,
      a.JoiningDate,
      a.email,
      dm.degname AS designation_name,
      stm.statustype AS status_type,
      a.BusinessNature,
      fm.ftype AS followup_type
    FROM accounts a
    LEFT JOIN SOURCEMASTER sm ON a.SourceID = sm.id
    LEFT JOIN DESIGNATIONMASTER dm ON a.DesignationID = dm.id
    LEFT JOIN STATUSMASTER stm ON a.StatusID = stm.id
    LEFT JOIN FOLLOWUPMASTER fm ON a.FollowupID = fm.id
    WHERE a.tenant_id = ?
    ORDER BY a.updated_at DESC`;
    params = [tenantid];
  } else {
    query = `SELECT u.* FROM Accounts u 
             INNER JOIN Accounts p ON u.assigned_user_id = p.assigned_user_id 
             WHERE p.id = ?`;
    params = [pid];
  }

  const [rows] = await pool.query(query, params);
  return [rows];
};

exports.getAccountsList = async (tenantid) => {
  const [rows] = await pool.query('SELECT DISTINCT id, name FROM Accounts WHERE tenant_id = ?', [tenantid]);
  return rows;
};

exports.getAccountById = async (data) => {
  const query = `SELECT 
    a.id,
    a.name,
    a.website,
    sm.srctype AS source_type,
    a.assigned_user_id,
    a.created_by_id,
    a.updated_at,
    a.Rating,
    a.ContPerson,
    a.Zone,
    a.Address1,
    a.Address2,
    a.City,
    a.StatusID,
    a.DesignationID,
    a.SourceID,
    a.Zip,
    a.States,
    a.Country,
    a.phone,
    a.waphone,
    a.JoiningDate,
    a.email,
    dm.degname AS designation_name,
    stm.statustype AS status_type,
    a.BusinessNature,
    fm.ftype AS followup_type
  FROM accounts a
  LEFT JOIN SOURCEMASTER sm ON a.SourceID = sm.id
  LEFT JOIN DESIGNATIONMASTER dm ON a.DesignationID = dm.id
  LEFT JOIN STATUSMASTER stm ON a.StatusID = stm.id
  LEFT JOIN FOLLOWUPMASTER fm ON a.FollowupID = fm.id
  WHERE a.tenant_id = ? AND a.id = ?
  ORDER BY a.updated_at DESC`;

  const [rows] = await pool.query(query, [data.tenantid, data.id]);
  return rows[0];
};

exports.updateById = async (account) => {
  const {
    id, name, industry, website, pid, Zone, Rating, ContPerson,
    Address1, Address2, City, Zip, State, Country, phone, waphone,
    email, BusinessNature, SourceID, DesignationID, StatusID
  } = account;

  const query = `UPDATE ACCOUNTS SET
    name = ?, website = ?, Zone = ?, Rating = ?, ContPerson = ?,
    Address2 = ?, email = ?, phone = ?, waphone = ?, BusinessNature = ?,
    Address1 = ?, City = ?, States = ?, Country = ?, Zip = ?,
    assigned_user_id = ?, SourceID = ?, DesignationID = ?, StatusID = ?
    WHERE id = ?`;

  const params = [name, website, Zone, Rating, ContPerson, Address2, email, phone, waphone,
    BusinessNature, Address1, City, State, Country, Zip, pid, SourceID, DesignationID, StatusID, id];

  const [result] = await pool.query(query, params);
  return result.affectedRows;
};

exports.getidDetails = async () => {
  const query = `
    SELECT sm.id AS srcid, sm.srctype, dm.id AS degid, dm.degname, st.id AS statid, st.statustype
    FROM SOURCEMASTER sm
    LEFT JOIN DESIGNATIONMASTER dm ON sm.id = dm.id
    LEFT JOIN STATUSMASTER st ON sm.id = st.id`;
  const [rows] = await pool.query(query);
  return [rows];
};

exports.deleteAccount = async (id) => {
  const [result] = await pool.query('DELETE FROM Accounts WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.insertAccount = async (account) => {
  const {
    name, website, pid, tenantid, Zone, Rating, ContPerson, Address1,
    Address2, City, Zip, State, Country, phone, waphone,
    JoiningDate, email, BusinessNature, SourceID, DesignationID, StatusID
  } = account;

  const query = `INSERT INTO ACCOUNTS (
    name, website, Zone, Rating, ContPerson, Address2, email, phone, 
    waphone, BusinessNature, Address1, City, States, JoiningDate,
    Country, Zip, assigned_user_id, created_by_id, SourceID,
    DesignationID, StatusID, tenant_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [name, website, Zone, Rating, ContPerson, Address2, email, phone, waphone,
    BusinessNature, Address1, City, State, JoiningDate, Country, Zip,
    pid, pid, SourceID, DesignationID, StatusID, tenantid];

  const [result] = await pool.query(query, params);
  return result.affectedRows;
};

exports.downloadCSV = async (data) => {
  const json2csv = new Parser();
  const idList = data.map(() => '?').join(',');

  const query = `SELECT 
    a.id,
    a.name,
    a.website,
    sm.srctype AS source_type,
    a.assigned_user_id,
    a.created_by_id,
    a.updated_at,
    a.Rating,
    a.ContPerson,
    a.Zone,
    a.Address1,
    a.Address2,
    a.City,
    a.StatusID,
    a.DesignationID,
    a.SourceID,
    a.Zip,
    a.States,
    a.Country,
    a.phone,
    a.waphone,
    a.JoiningDate,
    a.email,
    dm.degname AS designation_name,
    stm.statustype AS status_type,
    a.BusinessNature,
    fm.ftype AS followup_type
  FROM accounts a
  LEFT JOIN SOURCEMASTER sm ON a.SourceID = sm.id
  LEFT JOIN DESIGNATIONMASTER dm ON a.DesignationID = dm.id
  LEFT JOIN STATUSMASTER stm ON a.StatusID = stm.id
  LEFT JOIN FOLLOWUPMASTER fm ON a.FollowupID = fm.id
  WHERE a.id IN (${idList})
  ORDER BY a.updated_at DESC`;

  const [rows] = await pool.query(query, data);
  const csv = json2csv.parse(rows);
  return csv;
};
