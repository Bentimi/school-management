const bcrypt = require("bcryptjs");

const text = async () => {
    const test_name = 'admin12345'
    const name = await bcrypt.hash(test_name, 10)

    console.log(name)
} 

module.exports = text;