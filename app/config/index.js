module.exports = {
  AuthConfig: require('./auth.config'),
  DBConfig: require('./db.config'),
  JWTConfig: require('./jwt.config'),
  JWT_SECRET: require('./jwt.config').JWT_SECRET,
};
