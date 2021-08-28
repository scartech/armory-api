const express = require('express');
require('dotenv-flow').config();

const router = require('./routes');

const app = express();
app.use(express.json());

// Add all routes
app.use(router);

// Default homepage route
app.get('/', (req, res) =>
  res.status(200).setHeader('content-type', 'text/plain').send('Armory API'),
);

module.exports = app;
