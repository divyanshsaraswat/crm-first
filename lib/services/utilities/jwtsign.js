const jwt = require('jsonwebtoken');
const fs = require('fs');
async function generateToken(userid,role,tenantid) {
    const privateKey = fs.readFileSync('private.key', 'utf8');

    const token = jwt.sign({userid:userid,role:role,tenantid:tenantid},privateKey, { expiresIn: '16h' ,algorithm: 'RS256'});
    return token;
}

module.exports = { generateToken };