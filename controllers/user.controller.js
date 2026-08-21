const userService = require("../services/user.service")
const jwt = require('jsonwebtoken');
// const { v4: uuidv4 } = require("uuid");


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

         const payload = { 
            id: user._id || user.id,
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.success(
            { 
                user, 
                token: `Bearer ${token}` 
            }, 
            "Login successful"
        );

       
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // const csrfToken = uuidv4();
        // res.cookie('csrfToken', csrfToken, {
        //     httpOnly: true,
        //     secure: isProduction,
        //     sameSite: isProduction ? 'none' : 'strict',
        // });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
       
        // res.success({ user }, "Login successful")

    } catch (e) {
        console.log(e)
        next(e);
    }
}

const get_UserById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        console.log("User ID from JWT:", userId);
        const user = await userService.getUserById(userId);
        res.success({ user }, "User profile retrieved successfully");
    } catch (e) {
        next(e);
    }
}

module.exports = {
    create_User,
    login_User,
    get_UserById
}