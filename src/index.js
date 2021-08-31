const passport = require('passport');

const app = require('./server');
const { DBConfig } = require('./config');
require('./models');

// Authentication middlewares
require('./config/auth.config');
app.use(passport.initialize());

// DB connection
DBConfig.authenticate()
  .then(() => console.log('Successfully connected to the DB'))
  .catch((e) => console.error('Unable to connect to the DB', e));

// Create missing tables and columns
DBConfig.sync({ alter: true }).then(() => {
  console.log('Tables created/modified');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
