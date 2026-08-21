const userService = require("../services/user.service")
const jwt = require('jsonwebtoken');
const { generateCsrfToken } = require("../utils/random.utils");

const isProduction = process.env.NODE_ENV === 'production'

const cookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    maxAge
});

const csrfToken = generateCsrfToken()


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
            id: user._id,
        };

        const accessToken = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            payload, 
            process.env.JWT_REFRESH_SECRET, 
            { expiresIn: '7d' }
        );

        await userService.saveRefreshToken(user._id, newRefreshToken)
       
        res.cookie('refreshToken', 
            newRefreshToken, 
            cookieOptions(7 * 24 * 60 * 60 * 1000) 
        );

        res.cookie('csrfToken', 
            csrfToken, {
            httpOnly: false,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.cookie('accessToken', 
            accessToken,
            cookieOptions(15 * 60 * 1000)
        );
       
        res.success({ user }, "Login successful")

    } catch (e) {
        // console.log(e)
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