const passport = require('passport');

const app = require('./server');
const { DBConfig, logger } = require('./config');
const { UserService } = require('./services');
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

  UserService.users().then((users) => {
    if (!users || users.length === 0) {
      logger.info('Creating the initial user');
      UserService.create({
        email: process.env.INITIAL_USER,
        name: process.env.INITIAL_USER,
        password: process.env.INITIAL_PASSWORD,
        role: 'ADMIN',
        enabled: true,
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
