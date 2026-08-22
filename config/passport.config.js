const { Strategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const userService = require('../services/user.service');


// Cookie Extractor

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies.accessToken || null;
  }
  return null;
}

// Configuration options for the JWT strategy
const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET
};

// JWT Strategy
passport.use(
  new Strategy(options, async (jwtPayload, done) => {
    try {

      if (jwtPayload.jti) {
        const isBlacklisted = await userService.isTokenBlacklisted(jwtPayload.jti);

        if (isBlacklisted) {
          return done(null, false)
        }
      }
      
      const user = await userService.userProfile(jwtPayload.id); 

      if (user) {

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
