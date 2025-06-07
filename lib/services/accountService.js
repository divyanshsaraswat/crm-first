const { poolPromise } = require('../db/sqlConfig');
const {hashPassword,comparePassword} = require('../services/utilities/passwordhash');
const {generateToken} = require('../services/utilities/jwtsign');
const {Parser} = require('json2csv');

exports.getAccounts = async (data) => {
  const pool = await poolPromise;

  const {pid, role,tenantid} = data;
  let query1 = `SELECT 
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
where a.tenant_id = @tenantid
ORDER BY a.updated_at DESC;`
  let result;
  if (role=="admin"){
     result = await pool.request().input('tenantid',tenantid).query(query1);
  }
  if (role=="user" || role=="manager"){
    result = await pool.request()
      .input('id', pid)
      .query('SELECT u.* FROM Accounts u INNER JOIN Accounts p ON u.assigned_user_id = p.assigned_user_id WHERE p.id = @id;')
  }
  return result.recordsets;
};

exports.getAccountsList = async (tenantid) => {
  const pool = await poolPromise;
  const result = await pool.request().input('tenant_id',tenantid).query('SELECT DISTINCT id, name FROM Accounts where tenant_id=@tenant_id;');
  return result.recordset;
}
exports.getAccountById = async (data) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', data.id)
    .input('tenant_id',data.tenantid)
    .query('SELECT u.* FROM Accounts u INNER JOIN Accounts p ON u.assigned_user_id = p.assigned_user_id WHERE u.id = @id and u.tenant_id=@tenant_id;')
  return result.recordset[0];
}
exports.updateById = async (account) => {
  const pool = await poolPromise;
  const {
    id,
    name,
    industry,
    website,
    pid,
    Zone,
    Rating,
    ContPerson,
    Address1,
    Address2,
    City,
    Zip,
    State,
    Country,
    phone,
    waphone,
    email,
    BusinessNature,
    SourceID,
    DesignationID,
    StatusID,
  } = account;
  const result = await pool
    .request()
    .input('id', id)
    .input('name', name)
    .input('industry', industry)
    .input('website', website)
    .input('Zone', Zone)
    .input('Rating', Rating)
    .input('ContPerson', ContPerson)
    .input('Address2', Address2)
    .input('email', email || '')
    .input('phone', phone || '')
    .input('waphone', waphone || '')
    .input('BusinessNature', BusinessNature || '')
    .input('Address1', Address1 || '')
    .input('City', City || '')
    .input('State', State || '')
    .input('Country', Country || '')
    .input('Zip', Zip || '')
    .input('assigned_user_id', pid)
    .input('SourceID', SourceID)
    .input('DesignationID', DesignationID)
    .input('StatusID', StatusID)
    .query(`
      UPDATE ACCOUNTS SET
        name = @name,
        website = @website,
        Zone = @Zone,
        Rating = @Rating,
        ContPerson = @ContPerson,
        Address2 = @Address2,
        email = @email,
        phone = @phone,
        waphone = @waphone,
        BusinessNature = @BusinessNature,
        Address1 = @Address1,
        City = @City,
        States = @State,
        Country = @Country,
        Zip = @Zip,
        assigned_user_id = @assigned_user_id,
        SourceID = @SourceID,
        DesignationID = @DesignationID,
        StatusID = @StatusID
      WHERE id = @id;
    `);

  return result.rowsAffected;
};
exports.getidDetails = async(data)=>{
  const pool = await poolPromise;
  const query = `
WITH sm AS (
    SELECT ROW_NUMBER() OVER (ORDER BY id) AS rn, id AS srcid, srctype FROM SOURCEMASTER
),
dm AS (
    SELECT ROW_NUMBER() OVER (ORDER BY id) AS rn, id AS degid, degname FROM DESIGNATIONMASTER
),
st AS (
    SELECT ROW_NUMBER() OVER (ORDER BY id) AS rn, id AS statid, statustype FROM STATUSMASTER
)
SELECT 
    sm.srcid, sm.srctype,
    dm.degid, dm.degname,
    st.statid, st.statustype
FROM sm
FULL OUTER JOIN dm ON sm.rn = dm.rn
FULL OUTER JOIN st ON sm.rn = st.rn
ORDER BY COALESCE(sm.rn, dm.rn, st.rn);
`;
  const result = await pool.request().input('tenant_id',data.tenantid).query(query);
  return result.recordsets;
}
exports.deleteAccount = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Accounts WHERE id = @id;');
  return result.rowsAffected;
}
exports.insertAccount = async (account) => {
  const pool = await poolPromise;
  const {
      name,
      industry,
      website,
      pid,
      tenantid,
      Zone,
      Rating,
      ContPerson,
      Address1,
      Address2,
      City,
      Zip,
      State,
      Country,
      phone,
      waphone,
      email,
      BusinessNature,
      SourceID,
      DesignationID,
      StatusID,
    } = account;

  const result = await pool
    .request()
    .input('name', name)
    .input('website', website)
    .input('Zone', Zone)
    .input('Rating', Rating)
    .input('ContPerson', ContPerson)
    .input('Address2', Address2)
    .input('email', email || '')
    .input('phone', phone || '')
    .input('waphone', waphone || '')
    .input('BusinessNature', BusinessNature || '')
    .input('Address1', Address1 || '')
    .input('City', City || '')
    .input('State', State || '')
    .input('tenant_id',tenantid)
    .input('Country', Country || '')
    .input('Zip', Zip || '')
    .input('assigned_user_id', pid)
    .input('SourceID', SourceID)
    .input('DesignationID', DesignationID)
    .input('StatusID', StatusID)
    .query(`INSERT INTO ACCOUNTS (
      name, website, Zone, 
      Rating, ContPerson, Address2, email, phone, 
      waphone, BusinessNature, Address1, City, States, 
      Country, Zip, assigned_user_id,created_by_id, SourceID, 
      DesignationID, StatusID,tenant_id
    ) VALUES (
      @name, @website, @Zone,
      @Rating, @ContPerson, @Address2, @email, @phone,
      @waphone, @BusinessNature, @Address1, @City, @State,
      @Country, @Zip, @assigned_user_id,@assigned_user_id, @SourceID,
      @DesignationID, @StatusID, @tenant_id
    )`)
  return result.rowsAffected;
}
exports.downloadCSV = async (data) => {
   const json2csv = new Parser();
   const pool = await poolPromise;
   const idList = data.map(id => `'${id}'`).join(',');
   let query1 = `SELECT 
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
WHERE A.ID IN (${idList})
ORDER BY a.updated_at DESC;`
   const result = await pool.request().query(query1);
  const csv = json2csv.parse(result.recordset);
  return csv;
  
}