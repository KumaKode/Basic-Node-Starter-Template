const { StatusCodes } = require("http-status-codes");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { TokenExpiredError } = require("jsonwebtoken");
require("dotenv").config();

const { ServerConfig } = require("../../config");
const { UserService } = require("../../services");
const { UserRepository } = require("../../repositories");
const { ErrorResponse } = require("../common");

const userRepository = new UserRepository();

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = ServerConfig.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await UserService.getUser(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(null, error);
    }
  })
);

passport.checkAuth = (req, res, next) => {
  // Added Custom authenticating middleware in passport!
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user) {
      ErrorResponse.message = info.message;
      if (info instanceof TokenExpiredError)
        ErrorResponse.message = "Token has been expired";
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    req.user = user;
    next();
  })(req, res, next);
};

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: ServerConfig.GOOGLE_CLIENT_ID,
      clientSecret: ServerConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV
        ? process.env.PROD_GOOGLE_CALL_BACK_URL
        : ServerConfig.GOOGLE_CALL_BACK_URL,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      try {
        let user = await userRepository.getUserByEmail(profile.emails[0].value);

        if (user) {
          await user.update({
            emailVerified: true,
            socialLogin: "Google",
          });
        } else {
          const encryptedPassword = bcrypt.hashSync(
            profile.id,
            +ServerConfig.SALT_ROUNDS
          );
          user = await UserService.signup({
            name: profile.name.givenName,
            email: profile.emails[0].value,
            password: encryptedPassword,
            emailVerified: true,
            socialLogin: "Google",
            profilePicture: profile.photos[0].value,
          });
        }

        cb(null, user);
      } catch (error) {
        cb(error);
      }
    }
  )
);

var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
passport.use(
  new LinkedInStrategy(
    {
      clientID: ServerConfig.LINKEDIN_KEY,
      clientSecret: ServerConfig.LINKEDIN_SECRET,
      callbackURL: process.env.NODE_ENV
        ? process.env.PROD_LINKEDIN_CALL_BACK_URL
        : ServerConfig.LINKEDIN_CALL_BACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await userRepository.getUserByEmail(profile.email);

        if (user) {
          await user.update({
            emailVerified: true,
            socialLogin: "Linkedin",
          });
        } else {
          const encryptedPassword = bcrypt.hashSync(
            profile.id,
            +ServerConfig.SALT_ROUNDS
          );
          user = await UserService.signup({
            name: profile.givenName,
            email: profile.email,
            password: encryptedPassword,
            emailVerified: true,
            socialLogin: "Linkedin",
            profilePicture: profile.picture,
          });
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
