const express = require('express');
const passport = require('passport');
const router = require('./routes');
const db = require('./config/db.config');

// Create the Sequelize relationships
require('./models');

require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Authentication middlewares
require('./config/auth.config');
app.use(passport.initialize());

// DB connection
db.authenticate()
  .then(() => console.log('Successfully connected to the DB'))
  .catch((e) => console.error('Unable to connect to the DB', e));

// Create missing tables and columns
db.sync({ alter: true }).then(() => {
  console.log('Tables created/modified');
});

// Add all routes
app.use(router);

// Default homepage route
app.get('/', (req, res) => res.send('Armory API'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
