const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const Gun = db.define(
  'Gun',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    serialNumber: {
      type: DataTypes.STRING,
    },
    modelName: {
      type: DataTypes.STRING,
    },
    manufacturer: {
      type: DataTypes.STRING,
    },
    caliber: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    action: {
      type: DataTypes.STRING,
    },
    dealer: {
      type: DataTypes.STRING,
    },
    purchasePrice: {
      type: DataTypes.DECIMAL,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
    },
    buyer: {
      type: DataTypes.STRING,
    },
    salePrice: {
      type: DataTypes.DECIMAL,
    },
    saleDate: {
      type: DataTypes.DATEONLY,
    },
    picture: {
      type: DataTypes.BLOB,
    },
  },
  {
    underscored: true,
    tableName: 'guns',
    defaultScope: {
      attributes: {
        exclude: ['userId'],
      },
    },
  },
);

module.exports = Gun;
