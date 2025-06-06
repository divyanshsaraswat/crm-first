const { poolPromise } = require('../db/sqlConfig');
const {Parser} = require('json2csv');


exports.getTasks = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`SELECT 
  u.id,
  u.subject,
  u.body,
  v.statustype AS status,
  u.due_date,
  u.contact_id,
  u.created_at,
  w.username AS assigned_user_id,
  x.username AS created_by,
  u.updated_at
FROM Tasks u
JOIN Statusmaster v ON u.status = v.id
JOIN Users w ON u.assigned_user_id = w.id
JOIN Users x ON u.created_by = x.id;`);
  return result.recordsets;
};
exports.downloadCSV = async (data) => {
   const json2csv = new Parser();
   const pool = await poolPromise;
   
   const idList = data.map(id => `'${id}'`).join(',');
   const result = await pool.request().query(`SELECT u.id,subject,body,v.statustype as status,due_date,contact_id,created_at,assigned_user_id,created_by,updated_at from Tasks u join Statusmaster v on u.status=v.id where u.id in (${idList})`);
  const csv = json2csv.parse(result.recordset);
  return csv;
  
}
exports.getTaskById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * from Tasks WHERE id = @id;');
  return result.recordset[0];
}

exports.deleteTask = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Tasks WHERE id = @id;');
  return result.rowsAffected;
}
exports.insertTask = async (account) => {
  const pool = await poolPromise;
  const { subject, body, status, due_date, contact_id ,assigned_user_id,pid} = account;
  const result = await pool
    .request()
    .input('subject', subject)
    .input('body', body?body:'')
    .input('status', status)
    .input('due_date', due_date?due_date:'')
    .input('contact_id', contact_id)
    .input('assigned_user', assigned_user_id)
    .input('created_by',pid)
    .query('INSERT INTO Tasks (subject,body,status,due_date,contact_id,assigned_user_id,created_by) VALUES (@subject,@body,@status,@due_date,@contact_id,@assigned_user,@created_by);');
  return result.rowsAffected;
}
exports.updateTask = async (account) => {
  const pool = await poolPromise;
  const { id,subject, body, status, due_date, assigned_user_id } = account;
  const result = await pool
    .request()
    .input('id', id)
    .input('subject', subject)
    .input('body', body ? body : '')
    .input('status', status)
    .input('due_date', due_date ? due_date : '')
    .input('assigned_user', assigned_user_id)
    .query('UPDATE Tasks SET subject=@subject, body=@body, status=@status, due_date=@due_date, assigned_user_id=@assigned_user, updated_at=GETDATE() WHERE id=@id;');
  return result.rowsAffected;
}
