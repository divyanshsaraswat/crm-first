const jwt = require('jsonwebtoken');
const fs = require('fs');
async function generateToken(userid,role,tenantid,tenant_name) {
    const privateKey = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const token = jwt.sign({userid:userid,role:role,tenantid:tenantid,tenant_name:tenant_name},privateKey, { expiresIn: '16h' ,algorithm: 'RS256'});
    return token;
}

module.exports = { generateToken };