const { poolPromise } = require('../db/sqlConfig');



exports.getOpps = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * from Opportunities;');
  return result.recordsets;
};

exports.getOppById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * from Opportunities WHERE id = @id;');
  return result.recordset[0];
}

exports.deleteOpp = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Opportunities WHERE id = @id;');
  return result.rowsAffected;
}
exports.insertOpp = async (account) => {
  const pool = await poolPromise;
  const { name, amount, stage, close_date, account_id, contact_id, pid } =account;

  const result = await pool
    .request()
    .input('name', name)
    .input('amount', amount?amount:'')
    .input('stage', stage)
    .input('close_date', close_date?close_date:'')
    .input('account_id', account_id)
    .input('contact_id', contact_id)
    .input('assigned_user', pid)
    .query('INSERT INTO Opportunities (name,amount,stage,close_date,account_id,contact_id,assigned_user_id) VALUES (@name,@amount,@stage,@close_date,@account_id,@contact_id,@assigned_user);');
  return result.rowsAffected;
}
