const userService = require("../services/user.service");
const jwt = require('jsonwebtoken');
const { generateCsrfToken } = require("../utils/random.utils");
const { v4: uuidv4 } = require("uuid");

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
        res.status(201).json({ 
            status: 'success', 
            message: 'User registered successfully',
            user
        })

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
            jti: uuidv4()
        };

        const accessToken = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1hr' }
        );

        const newRefreshToken = jwt.sign(
            payload, 
            process.env.JWT_REFRESH_SECRET, 
            { expiresIn: '7d' }
        );

        console.log("Encoded", payload)
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
            cookieOptions(60 * 60 * 1000)
        );
       
        res.success({ user }, "Login successful")

    } catch (e) {
        // console.log(e)
        next(e);
    }
}

const user_Profile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // console.log("User ID from JWT:", userId);
        const user = await userService.userProfile(userId);
        res.success({ user }, "User profile retrieved successfully");
    } catch (e) {
        next(e);
    }
}

const refresh_Token = async (req, res, next) => {
    try {

        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({
                status: false,
                message: 'Refresh token missing'
            });
        }

        // verify the refresh token
        let payload;

        try {
            payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return res.status(401).json({
                status: false,
                message: 'invalid or expired refresh token'
            });
        }

        // Check if refres token still exists in the db
        const isValid = await userService.isRefreshTokenValid(
            payload.id,
            oldRefreshToken
        );

        if (!isValid) {
            await userService.revokeAllRefreshToken(payload.id);
            return res.status(401).json({
                status: false,
                message: 'Refresh token reuse detected. All sessions revoked.'
            });
        }

        const newAccessToken = jwt.sign(
            { id: payload.id, jti: uuidv4() },
            process.env.JWT_SECRET,
            { expiresIn: '1hr' }
        );

        const newRefreshToken = jwt.sign(
            { id: payload.id, jti: uuidv4() },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Remove the old Refresh token from DB
        await userService.revokeRefreshToken(payload.id, oldRefreshToken);

        await userService.saveRefreshToken(payload.id, newRefreshToken);

        res.cookie('accessToken', 
            newAccessToken,
            cookieOptions(60 * 60 * 1000)    
        );
       
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

        res.success(null, 'Tokens rotated successfully');

    } catch (e) {
        next(e);
    }
}

const logout_User = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (accessToken) {
            try {
                const decoded = jwt.verify(
                accessToken, process.env.JWT_SECRET
                )

                // console.log('Decoded', decoded)
                if (decoded.jti) {
                    await userService.blacklistToken(decoded.jti, decoded.exp)
                }
            } catch (e) {
                // console.log(e)
            }
        }

        if (refreshToken) {
            await userService.revokeRefreshToken(userId, refreshToken);
        }

        res.clearCookie('accessToken', 
            cookieOptions(0)
        );

        res.clearCookie('refreshToken',
            cookieOptions(0)
        );
        

        res.clearCookie('csrfToken',
            cookieOptions(0)
        );

        res.success(null, 'Logged out successfully');

    } catch (e) {
        next(e);
    }
}

const change_Password = async (req, res, next) => {
    try {
        const userId = req.user.id
        const refreshToken = req.cookies.refreshToken
        const data = req.body;

        const result = await userService.changePassword(userId, data)
        if (refreshToken) {
            await userService.revokeOtherRefreshToken(userId, refreshToken)
        } 
        res.success(result, "Password Changed")
    } catch (e) {
        next(e);
    }
}

const forget_Password = async (req, res, next) => {
    try {
        const data = req.body;

        const user = await userService.forgetPassword(data);
        res.success(null, "reset password link has been sent the provided email ")
    } catch (e) {
        next(e);
    }
}

const reset_Password = async (req, res, next) => {
    try {
        const token = req.query.token;
        const data = req.body;
        const user = await userService.resetPassword(token, data);

    } catch (e) {
        next (e);
    }
}

module.exports = {
    create_User,
    login_User,
    user_Profile,
    refresh_Token,
    logout_User,
    change_Password,
    forget_Password,
    reset_Password
}