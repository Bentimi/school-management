const crypto =  require("crypto")

const generateCsrfToken = () => {
    num = crypto.randomBytes(32).toString('hex');
    return num
}

module.exports = {
    generateCsrfToken
}