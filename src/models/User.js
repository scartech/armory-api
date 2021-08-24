const bcrypt = require('bcrypt');
const db = require('../config/database');
const { Sequelize, DataTypes } = require('sequelize');

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

User.hashPassword = async (password) => {
  if (!password) {
    return '';
  }

  const saltRounds = 8;
  return bcrypt.hash(password, saltRounds);
};

User.sync({ alter: true }).then(() => {
  console.log('Users table created/modified');
});

module.exports = User;
