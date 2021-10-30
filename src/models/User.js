const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const base32 = require('thirty-two');
const db = require('../config/db.config');

/**
 * User model
 * @typedef {object} User
 * @property {integer} id.required - ID
 * @property {string} email.required - User's email address
 * @property {string} name.required - User's full name
 * @property {string} role.required - Role - currently only ADMIN or USER
 * @property {boolean} enabled.required - Is the user account enabled?
 * @property {string} password.required - Password - password
 * @property {boolean} totpEnabled - Is MFA enabled for the user
 * @property {boolean} totpValidated - Has the user validated a TOTP token
 * @property {string} totpKey - Unique key for the user to generate TOTP tokens
 * @property {string} totpUrl - URL for the user's TOTP key for adding to a TOTP App (Authy, etc)
 * @property {array<Gun>} guns - The user's guns
 */
const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    totpEnabled: {
      type: DataTypes.BOOLEAN,
    },
    totpValidated: {
      type: DataTypes.BOOLEAN,
    },
    totpKey: {
      type: DataTypes.TEXT,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    totpUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.totpKey
          ? `otpauth://totp/Armory?secret=${base32.encode(this.totpKey)}`
          : '';
      },
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'users',
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
  },
);

/**
 * Hashes a password using bcrypt for storage in the DB
 * @param {string} password - Password to hash
 * @returns {string} The hashed password
 */
User.hashPassword = async (password) => {
  if (!password) {
    return '';
  }

  const saltRounds = 8;
  return bcrypt.hash(password, saltRounds);
};

module.exports = User;
