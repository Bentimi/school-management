const userService = require("../services/user.service")


const create_User = async (req, res, next) => {
    try {

        const data = req.body;
        const user = await userService.createUser(req.body);
        res.status(201).json({ status: 'success', user})

    } catch (e) {
        next(e);
    }
}


const login_User = async (req, res, next) => {
    try {
        const data = req.body;
        const user = await userService.loginUser(req.body);
        
       res.success({ user }, "Login successful")

    } catch (e) {
        next(e);
    }
}

module.exports = {
    create_User,
    login_User
}