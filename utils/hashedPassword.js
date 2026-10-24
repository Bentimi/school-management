const bcrypt = require("bcryptjs");

const passwordHash = (pwd) => {
    return bcrypt.hash(pwd, 10)
}

module.exports = passwordHash;