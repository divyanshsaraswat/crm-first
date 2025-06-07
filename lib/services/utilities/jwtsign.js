const jwt = require('jsonwebtoken');
const fs = require('fs');
async function generateToken(userid,role,tenantid) {
    const privateKey = process.env.JWT_PRIVATE_KEY;

    const token = jwt.sign({userid:userid,role:role,tenantid:tenantid},privateKey, { expiresIn: '16h' ,algorithm: 'RS256'});
    return token;
}

module.exports = { generateToken };