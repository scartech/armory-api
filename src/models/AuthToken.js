const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * AuthToken model
 * @typedef {object} AuthToken
 * @property {integer} id.required - ID
 * @property {string} selector - Value used to select record from DB
 * @property {string} hashedValidator - hashed validator value
 * @property {date} expires - date the auth token expires
 * @property {integer} userId - ID of the user that owns the auth token
 */
const AuthToken = db.define(
  'AuthToken',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    selector: {
      type: DataTypes.STRING,
    },
    hashedValidator: {
      type: DataTypes.STRING,
    },
    expires: {
      type: DataTypes.DATE,
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'auth_tokens',
    indexes: [
      {
        fields: ['selector'],
      },
    ],
  },
);

module.exports = AuthToken;
