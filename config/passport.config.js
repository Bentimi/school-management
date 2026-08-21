const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const userService = require('../services/user.service'); 

// Configuration options for the JWT strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

// JWT Strategy
passport.use(
  new Strategy(options, async (jwtPayload, done) => {
    try {
      
      const user = await userService.getUserById(jwtPayload.id); 

      if (user) {
        // Token is valid; attach user object to req.user

        console.log("User found:", user);
        return done(null, user);
      } else {
        // User not found in database
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
