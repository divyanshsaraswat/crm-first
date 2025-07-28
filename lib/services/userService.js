// Switch to your new MySQL config file and import the pool directly
const {pool} = require('../db/sqlConfig'); 
const { Parser } = require('json2csv');
const { hashPassword, comparePassword } = require('../services/utilities/passwordhash');
const nodemailer = require('nodemailer');
const { generateToken } = require('../services/utilities/jwtsign');

exports.insertSetting = async(data)=>{
  console.log(data);
  try{
    const sql = `INSERT INTO user_settings (
        user_id, notify_email, notify_browser, notify_lead_alerts, 
        notify_task_reminders, date_format, time_format, currency, theme
    ) VALUES (?, 1, 1, 1, 1, 'dd-mm-yyyy', '12h', 'INR', 'light');`;
    const [result] = await pool.execute(sql, [data[0].id]);
    return result.affectedRows;
  } catch(error){
    console.error(error)
  }
};

exports.getFollowUp = async(data)=>{
 try{ 
  const [rows] = await pool.execute('Select * from followupmaster;');
  return [rows]; // Return as array of arrays to match original `recordsets`
  } catch(error){
    console.error(error)
  }
}

exports.insertUserFollowUp = async(data)=>{
  try {
    const sql = 'update accounts set FollowupID=?, Descriptions=? where id=?;';
    const [result] = await pool.execute(sql, [data?.fid, data?.message, data?.id]);
    return [result]; // Match original `recordsets`
  } catch (error) {
      console.error(error)
  }
}

exports.getUsers = async (data) => {
  const {pid, role,tenantid} = data;
  let rows;
  if (role=="admin"){
    const sql = 'SELECT u.id,u.username,u.email,u.role,v.username as parent_id,u.created_at,u.tenant_id as Organisation_ID from Users u join Users v on u.parent_id=v.id where u.tenant_id=? and u.is_active=1;';
    [rows] = await pool.execute(sql, [tenantid]);
  }
  if (role=="user" || role=="manager"){
    const sql = 'SELECT u.id,u.username,u.email,p.username,u.created_at FROM Users u INNER JOIN Users p ON u.parent_id = p.parent_id WHERE p.id = ? and u.is_active=1;';
    [rows] = await pool.execute(sql, [pid]);
  }
  return [rows]; // Match original `recordsets`
};

exports.sendMail = async(data)=>{
  const {title,sender,body,type,username,company,subject}  = data
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'divyanshsaraswatofficial@gmail.com',
    pass: 'tzdm lbmu vmpn hada'
  }
});

// ... (The rest of the sendMail function remains unchanged) ...
let mailOptions;
if (type=="userR"){
  mailOptions = {
  from: 'divyanshsaraswatofficial@gmail.com',
  to: sender,
  subject: title?title:`Welcome ${username}!`,
  text: body?body:'',
  html:`<div style="font-family: Arial, sans-serif; background-color: #f6fff7; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
    
    <div style="background-color: #2ecc71; padding: 30px 40px; color: white; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Welcome to the Team! 🌿</h1>
    </div>

    <div style="padding: 30px 40px; color: #333;">
      <p style="font-size: 18px; line-height: 1.6;">
        Hello ${username},
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        We're excited to welcome you to <strong>${company}</strong>! Your user account has been successfully created and you're now part of our organization.
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        You can now access internal resources, collaborate with the team, and start contributing. If you need any help getting started, feel free to reach out to your manager or IT support.
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        We're glad to have you with us and look forward to achieving great things together. 🚀
      </p>
    </div>

    <div style="background-color: #ecfdf1; padding: 20px 40px; text-align: center; color: #2ecc71;">
      <p style="margin: 0; font-size: 14px;">
        © 2025 ${company}. Internal Use Only.
      </p>
    </div>

  </div>
</div>
`
};
}
else if (type=="accountsR"){
  mailOptions = {
  from: 'divyanshsaraswatofficial@gmail.com',
  to: sender,
  subject: title?title:'Welcome to our Company!',
  text: body?body:'',
  html:`<div style="font-family: Arial, sans-serif; background-color: #f6fff7; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
    
    <div style="background-color: #2ecc71; padding: 30px 40px; color: white; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Welcome to Our Company 🌿</h1>
    </div>

    <div style="padding: 30px 40px; color: #333;">
      <p style="font-size: 18px; line-height: 1.6;">
        Hello,
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        We're excited to let you know that you are now officially <strong>registered as a fellow client</strong> with our company!
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        We're thrilled to have you on board, and we look forward to working together. If you have any questions or need assistance, feel free to reach out.
      </p>
      <p style="font-size: 16px; line-height: 1.6;">
        Here's to a great journey ahead! 🌱
      </p>
    </div>

    <div style="background-color: #ecfdf1; padding: 20px 40px; text-align: center; color: #2ecc71;">
      <p style="margin: 0; font-size: 14px;">
        © 2025 Your Company Name. All rights reserved.
      </p>
    </div>

  </div>
</div>
`
};
}

else if (type=="tasksC"){
    mailOptions = {
  from: 'divyanshsaraswatofficial@gmail.com',
  to: sender,
  subject: title?title:'A New Task Has Been Created for You',
  text: body?body:'',
  html:`<div style="font-family: Arial, sans-serif; background-color: #f6fff7; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <div style="background-color: #2ecc71; padding: 30px 40px; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Task Assigned 📌</h1>
        </div>

        <div style="padding: 30px 40px; color: #333;">
          <p style="font-size: 18px; line-height: 1.6;">
            Hello there!,
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            We're letting you know that a new task titled <strong>${subject?subject:''}</strong> has been created and linked to your account.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Description: No additional details provided.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            If you have any questions or need support, feel free to get in touch with your point of contact at <strong>${company?company:""}</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for being with us!
          </p>
        </div>

        <div style="background-color: #ecfdf1; padding: 20px 40px; text-align: center; color: #2ecc71;">
          <p style="margin: 0; font-size: 14px;">
            © 2025 ${company?company:""}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
`
};
}
else if (type=="tasksU"){
 mailOptions = {
    from: 'divyanshsaraswatofficial@gmail.com',
    to: sender,
    subject: title ? title : 'A New Task Has Been Created for You',
    text: body ? body : '',
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f6fff7; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        
        <div style="background-color: #2ecc71; padding: 30px 40px; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Task Assigned 📌</h1>
        </div>

        <div style="padding: 30px 40px; color: #333;">
          <p style="font-size: 18px; line-height: 1.6;">
            Hello there!,
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            We're letting you know that a new task titled <strong>${subject}</strong> has been created and linked to your account.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Description: ${body}.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            If you have any questions or need support, feel free to get in touch with your point of contact at <strong>${company}</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for being with us!
          </p>
        </div>

        <div style="background-color: #ecfdf1; padding: 20px 40px; text-align: center; color: #2ecc71;">
          <p style="margin: 0; font-size: 14px;">
            © 2025 ${company}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
    `
  };
}

try {
  const info = await transporter.sendMail(mailOptions);
  return info;
} catch (error) {
  console.error('Email error:', error);
  return false;
}
}

exports.getSignedDetails = async(data)=>{
  const {pid} = data;
  const sql = `select * from users where id=?;`;
  const [rows] = await pool.execute(sql, [pid]);
  return [rows]; // Match original `recordsets`
}

exports.createWhatsApp = async(data)=>{
// ... (createWhatsApp function remains unchanged) ...
  const {type,to,params} = data;
  let requestBody;
  if (type=="creation"){
    requestBody = {
     "messaging_product": "whatsapp",
     "to": to,
     "type": "template",
     "template": {
       "name": "accountcreation",
       "language": { "code": "en_US" },
       "components": [
         {
           "type": "body",
           "parameters": params.map((res,idx) => ({"type": "text", "text": `${res}`}))
         }
       ]
     }
   };
  }
  else{
    requestBody = {
     "messaging_product": "whatsapp",
     "to": to,
     "type": "template",
     "template": {
       "name": "taskcreation",
       "language": { "code": "en_US" },
       "components": [
         {
           "type": "body",
           "parameters": params.map((res,idx) => ({"type": "text", "text": `${res}`}))
         }
       ]
     }
   };
  }
   try {
    const response = await fetch(process.env.WH_END, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WH_TOKEN}`
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

exports.forgotpassword = async(data)=>{
  const {pid,oldpassword,password} = data;
  const [userRows] = await pool.execute(`select password_hash from users where id=?;`, [pid]);
  if(userRows.length === 0) return false;
  
  const check = comparePassword(oldpassword, userRows[0].password_hash);
  if (check){
    const newpassword =await hashPassword(password);
    try {
      const sql = 'UPDATE Users SET password_hash = ? WHERE id = ?;';
      const [updateResult] = await pool.execute(sql, [String(newpassword), pid]);
      return updateResult.affectedRows;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
  else{
    return false
  }
}

exports.updateSettings = async(data)=>{
  const {
  pid,notify_email,
  notify_browser,
  notify_lead_alerts,
  notify_task_reminders,
  date_format,
  time_format,
  currency,
  theme} = data
try {
  const sql = `
    UPDATE user_settings
    SET
        notify_email = ?, notify_browser = ?, notify_lead_alerts = ?,
        notify_task_reminders = ?, date_format = ?, time_format = ?,
        currency = ?, theme = ?
    WHERE user_id = ?;`;
  const params = [
    notify_email ? 1 : 0, notify_browser ? 1 : 0, notify_lead_alerts ? 1 : 0,
    notify_task_reminders ? 1 : 0, date_format, time_format,
    currency, theme, pid
  ];
  const [result] = await pool.execute(sql, params);
  return result.affectedRows;
} catch (error) {
  console.error('Error updating settings:', error);
  throw error;
}
}

exports.getSettings = async(data)=>{
  const {pid} = data
  const sql = `select * from user_settings where user_id=?;`;
  const [rows] = await pool.execute(sql, [pid]);
  return [rows]; // Match original `recordsets`
}

exports.getRoles = async()=>{
  const [rows] = await pool.execute('Select * from UserRoles;');
  return rows; // Match original `recordset`
}

exports.getDetails = async (pid)=>{
  const sql = 'SELECT * FROM USERS WHERE ID=?;';
  const [rows] = await pool.execute(sql, [pid]);
  return rows[0]; // Match original `recordset[0]`
}

exports.updateById = async(data)=>{
  const {id,username,email,userrole} = data
  try {
    const sql = 'UPDATE USERS SET username=?, email=?, role=? where id=?;';
    const [result] = await pool.execute(sql, [username, email, userrole, id]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

exports.getUserById = async (data) => {
  const sql = 'SELECT distinct u.* FROM Users u INNER JOIN Users p ON u.parent_id = p.parent_id WHERE u.id = ?;';
  const [rows] = await pool.execute(sql, [data.id]);
  return rows[0];
}

exports.insertUser = async (user) => {
  const { username, email, password,userrole,pid,tenantid } = user;
  const hashedPassword = await hashPassword(password);
  const insertSql = 'INSERT INTO Users (username, email, password_hash,parent_id,role,tenant_id) VALUES (?, ?, ?, ?, ?, ?);';
  await pool.execute(insertSql, [username, email, hashedPassword, pid, userrole? userrole : 'user', tenantid]);
  
  const selectSql = 'SELECT id FROM Users WHERE email = ?';
  const [rows] = await pool.execute(selectSql, [email]);
  return rows; // Match original `recordset`
}

exports.addLogs = async (user) => {
  const {pid,tenantid,action,role} = user;
  const sql = `INSERT INTO Logs (action, role, userid, tenant_id) VALUES (?, ?, ?, ?);`;
  const [result] = await pool.execute(sql, [action, role ?? 'user', pid, tenantid]);
  return result.affectedRows;
}

exports.deleteUser = async (id) => {
  try {
    const sql = 'UPDATE users set is_active=0 WHERE id = ?;';
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
  } catch (error) {
    console.error(error)
  }
}

exports.getUserWhatsApp = async (id)=>{
  try {
    const sql = 'Select u.wh_id as Wh_ID,u.wh_auth as Wh_auth , w.phone as Wh_phone from user_settings u join users v on u.user_id=v.id join tenants w on v.tenant_id=w.id where u.user_id=? ;';
    const [rows] = await pool.execute(sql, [id]);
    return [rows]; // Match original `recordsets`
  } catch (error) {
    console.error(error)
  }
}

exports.updateUserWhatsapp = async(data)=>{
  const {pid,wid,watoken} = data;
  try {
    const sql = 'UPDATE user_settings set wh_id=?, wh_auth=? where user_id=?;';
    const [result] = await pool.execute(sql, [wid, watoken, pid]);
    return result.affectedRows;
  } catch (error) {
    console.error(error)
  }
}

exports.checkcmd = async (query) => {
  // WARNING: Executing raw queries like this is vulnerable to SQL injection.
  const [rows] = await pool.query(query); 
  return rows; // Match original `recordset`
}

exports.login = async (email,password) => {
  const sql = 'SELECT u.password_hash,u.role,u.id,u.tenant_id,v.name as tenant_name FROM Users u join tenants v on u.tenant_id=v.id WHERE u.email = ?;';
  const [rows] = await pool.execute(sql, [email]);
  if (rows.length === 0) {
    return false;
  }
  const user = rows[0];
  const check = comparePassword(password, user.password_hash);
  if (check){
    const token = generateToken(user.id, user.role, user.tenant_id, user.tenant_name);
    return token;
  }
  return false;
}

exports.downloadCSV = async (data) => {
  const json2csv = new Parser();
  const idList = data.map(id => pool.escape(id)).join(','); // Use pool.escape for safety
  const sql = `
    SELECT u.id, u.username, u.email, w.username as CreatorName, u.created_at, v.name as Organisation 
    FROM Users u 
    JOIN tenants v ON u.tenant_id = v.id 
    JOIN Users w ON u.parent_id = w.id 
    WHERE u.id IN (${idList})
  `;
  const [rows] = await pool.query(sql); // Use .query for dynamic IN clause
  const csv = json2csv.parse(rows);
  return csv;
}

exports.getAllByUserIdNotif = async (userId) => {
  const sql = 'SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC;';
  const [rows] = await pool.execute(sql, [userId]);
  return rows;
};

exports.createNotif = async ({ user_id, title, message,type }) => {
  try {
    const sql = 'INSERT INTO Notifications (user_id, title, message,type) VALUES (?, ?, ?, ?);';
    const finalUserId = type=="tasks" ? user_id : user_id[0]?.id;
    const [result] = await pool.execute(sql, [finalUserId, title, message, type]);
    return result;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

exports.markAsReadNotif = async (id) => {
  try {
    const sql = 'UPDATE Notifications SET is_read = 1 WHERE id = ?;';
    const [result] = await pool.execute(sql, [id]);
    return result;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

exports.deleteByIdNotif = async (id) => {
  try {
    const sql = 'DELETE FROM Notifications WHERE id = ?;';
    const [result] = await pool.execute(sql, [id]);
    return result;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};