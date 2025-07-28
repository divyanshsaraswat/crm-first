const { pool } = require('../db/sqlConfig');

exports.getCampaign = async () => {
  const [rows] = await pool.query('SELECT * FROM Campaigns;');
  return [rows];
};

exports.getCampaignById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM Campaigns WHERE id = ?', [id]);
  return rows[0];
};

exports.deleteCampaign = async (id) => {
  const [result] = await pool.query('DELETE FROM Campaigns WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.insertCampaign = async (account) => {
  const { name, status, start_date, end_date, budget } = account;
  const query = 'INSERT INTO Campaigns (name, status, start_date, end_date, budget) VALUES (?, ?, ?, ?, ?)';
  const values = [name, status, start_date || '', end_date || '', budget || ''];

  const [result] = await pool.query(query, values);
  return result.affectedRows;
};
