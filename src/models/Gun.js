const { Sequelize, DataTypes } = require('sequelize');
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
      allowNull: false,
      unique: true,
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
      type: DataTypes.DECIMAL,
    },
  },
  {
    underscored: true,
    tableName: 'guns',
  },
);

module.exports = Gun;
