const passport = require('passport');

const app = require('./server');
const { DBConfig, logger } = require('./config');
require('./models');

// Authentication middlewares
require('./config/auth.config');
app.use(passport.initialize());

// DB connection
DBConfig.authenticate()
  .then(() => logger.info('Successfully connected to the DB'))
  .catch((e) => logger.error('Unable to connect to the DB', e));

// Create missing tables and columns
DBConfig.sync({ alter: true }).then(() => {
  logger.info('Tables created/modified');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
