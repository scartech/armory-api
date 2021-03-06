const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv-flow').config();

const { accessLogger } = require('./config');

const expressJSDocSwagger = require('express-jsdoc-swagger');
const swaggerUI = require('swagger-ui-express');

const router = require('./routes');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '75mb' }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

// Add logging middleware
app.use(
  morgan(
    ':remote-addr - :method :url :status :res[content-length] ":user-agent"',
    {
      stream: accessLogger.stream,
    },
  ),
);

// Add all routes
app.use(router);

// Default homepage route
app.get('/', (req, res) =>
  res.status(200).setHeader('content-type', 'text/plain').send('Armory API'),
);

const swaggerOptions = {
  info: {
    version: '1.0.0',
    title: 'Armory API',
    description: '2A inventory management.',
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
  swaggerUiOptions: {
    swaggerOptions: {
      persistAuthorization: true,
    },
  },
};

expressJSDocSwagger(app)(swaggerOptions);

module.exports = app;
