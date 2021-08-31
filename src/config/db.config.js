const { Sequelize } = require('sequelize');

const db = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'postgres',
  logging: false,
});

module.exports = db;

// module.exports = {
//   HOST: process.env.DB_HOST,
//   PORT: process.env.DB_PORT,
//   USER: process.env.DB_USER,
//   PASSWORD: process.env.DB_PASSWORD,
//   DATABASE: process.env.DB_NAME,
//   DIALECT: 'postgres',
// };
