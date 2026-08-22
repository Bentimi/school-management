const crypto = require("crypto");

const hashedToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = hashedToken;