const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * User model
 * @typedef {object} User
 * @property {integer} id - ID
 * @property {string} email - User's email address
 * @property {string} name - User's full name
 * @property {boolean} admin - Is the user an admin?
 * @property {boolean} enabled - Is the user account enabled?
 * @property {string} password - User's password - password
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
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    underscored: true,
    tableName: 'users',
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
    defaultScope: {
      where: {
        enabled: true,
      },
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
