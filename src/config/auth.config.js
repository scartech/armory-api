const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const JWT_SECRET = require('./jwt.config').JWT_SECRET;
const User = require('../models/User');

/**
 * Handles user login.
 */
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.scope('withPassword').findOne({
          where: {
            email,
          },
        });

        if (!user) {
          return done(null, false, { message: 'Login failed.' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return done(null, false, { message: 'Login failed.' });
        }

        // Valid user login
        return done(null, user, { message: 'Logged in successfully.' });
      } catch (error) {
        done(error);
      }
    },
  ),
);

/**
 * Verifies that the JWT token is valid.
 */
passport.use(
  new JwtStrategy(
    {
      secretOrKey: `${JWT_SECRET}`,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['HS256'],
      jsonWebTokenOptions: {
        maxAge: '2h',
        clockTolerance: 120,
      },
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    },
  ),
);
