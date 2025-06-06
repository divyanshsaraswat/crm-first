const { poolPromise } = require('../db/sqlConfig');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');
const {Parser} = require('json2csv');

exports.getContacts = async (data) => {
  const pool = await poolPromise;
  const {pid, role} = data;

  let result;
  if (role=="admin"){
     result = await pool.request().query('SELECT * from Contacts;');
  }
  if (role=="user" || role=="manager"){
    result = await pool.request()
      .input('id', pid)
      .query('SELECT u.* FROM Contacts u INNER JOIN Contacts p ON u.contact_owner_id = p.contact_owner_id WHERE p.id = @id;')
  }
  return result.recordsets;
};


exports.getContactById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', id)
    .query('SELECT u.* FROM Contacts u INNER JOIN Contacts p ON u.contact_owner_id = p.contact_owner_id WHERE u.id = @id;')
  return result.recordset[0];
}

exports.insertContact = async (contact) => {
  const pool = await poolPromise;
  const { first_name, last_name, email, phone,account_id, pid } = contact;

  const result = await pool
    .request()
    .input('first_name', first_name? first_name : '')
    .input('last_name', last_name)
    .input('email', email? email : '')
    .input('phone', phone? phone : '')
    .input('account_id', account_id)
    .input('id', pid)
    .query('INSERT INTO Contacts (first_name, last_name, email, phone, account_id,contact_owner_id) VALUES (@first_name, @last_name, @email, @phone, @account_id,@id);');
  return result.rowsAffected;
}

exports.updateById = async(data)=>{
  const {id,first_name,last_name,email,phone,account_id} = data
  const pool = await poolPromise;
  const result = await pool.request()
  .input('id',id)
  .input('first_name',first_name)
  .input('last_name',last_name)
  .input('email',email)
  .input('phone',phone)
  .input('account_id',account_id)
  .query(`UPDATE CONTACTS SET first_name=@first_name,last_name=@last_name,email=@email,phone=@phone,account_id=@account_id where id=@id;`)
  return result.rowsAffected;
}
exports.deleteContact = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Contacts WHERE id = @id;');
  return result.rowsAffected;
};
exports.downloadCSV = async (data) => {
   const json2csv = new Parser();
   const pool = await poolPromise;
   const idList = data.map(id => `'${id}'`).join(',');
   const result = await pool.request().query(`SELECT * from Contacts where id in (${idList})`);
  const csv = json2csv.parse(result.recordset);
  return csv;
  
}