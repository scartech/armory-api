const express = require('express');
require('dotenv-flow').config();

const expressJSDocSwagger = require('express-jsdoc-swagger');
const swaggerUI = require('swagger-ui-express');

const router = require('./routes');

const app = express();
app.use(express.json());

// Add all routes
app.use(router);

// Default homepage route
app.get('/', (req, res) =>
  res.status(200).setHeader('content-type', 'text/plain').send('Armory API'),
);

const swaggerOptions = {
  info: {
    version: '1.0.0',
    title: 'Express API for Armory',
    description: 'API used to support the Armory frontend.',
    license: {
      name: 'Unlicense',
      url: 'https://unlicense.org',
    },
    contact: {
      name: 'Tim Scarborough',
      url: 'https://github.com/scartech',
      email: 'scarborough.tim@gmail.com',
    },
  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  swaggerUIPath: '/docs',
  baseDir: __dirname,
  filesPattern: './**/*.js',
};

expressJSDocSwagger(app)(swaggerOptions);

module.exports = app;
