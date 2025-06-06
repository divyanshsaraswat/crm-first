const { poolPromise } = require('../db/sqlConfig');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');


exports.getLeads = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * from Leads;');
  return result.recordsets;
};
exports.getLeadById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * from Leads WHERE id = @id;');
  return result.recordset[0];
};

exports.deleteLead = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Leads WHERE id = @id;');
  return result.rowsAffected;
}
exports.insertLead = async (account) => {
  const pool = await poolPromise;
  const { first_name,last_name,email,status,contacts_user_id,pid } = account;

  const result = await pool
    .request()
    .input('first_name', first_name?first_name:'')
    .input('last_name', last_name)
    .input('email', email?email:'')
    .input('status', status)
    .input('contacts_user_id', contacts_user_id?contacts_user_id:'')
    .input('assigned_user', pid)
    .query('INSERT INTO Leads (first_name,last_name,email,status,contacts_user_id,assigned_user_id) VALUES (@first_name,@last_name,@email,@status,@contacts_user_id,@assigned_user);');
  return result.rowsAffected;
}
