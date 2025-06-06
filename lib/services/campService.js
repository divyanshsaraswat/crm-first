const { poolPromise } = require('../db/sqlConfig');



exports.getCampaign = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * from Campaigns;');
  return result.recordsets;
};

exports.getCampaignById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * from Campaigns WHERE id = @id;');
  return result.recordset[0];
}

exports.deleteCampaign = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Campaigns WHERE id = @id;');
  return result.rowsAffected;
}
exports.insertCampaign = async (account) => {
  const pool = await poolPromise;
    const { name, status, start_date, end_date, budget } = account;

  const result = await pool
    .request()
    .input('name', name)
    .input('status', status)
    .input('start_date', start_date ? start_date : '')
    .input('end_date', end_date ? end_date : '')
    .input('budget', budget ? budget : '')
    .query('INSERT INTO Campaigns (name,status,start_date,end_date,budget) VALUES (@name,@status,@start_date,@end_date,@budget);');
  return result.rowsAffected;
}
