const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * Gun model
 * @typedef {object} Gun
 * @property {integer} id.required - ID
 * @property {string} name - A user defined name
 * @property {string} serialNumber - Serial number
 * @property {string} modelName - The manufacturer's model name
 * @property {string} manufacturer - The gun's manufacturer
 * @property {string} caliber - The caliber of the gun. 9mm, .223, etc.
 * @property {string} type - Rifle, pistol, shotgun, etc.
 * @property {string} action - semi auto, revolver, etc.
 * @property {string} dealer - Who was the gun purchased from
 * @property {number} purchasePrice - How much was paid for the gun - float
 * @property {string} purchaseDate - Purchase date - date
 * @property {string} ffl - Who was the FFL used when purchasing the gun
 * @property {string} buyer - Who was the gun sold to
 * @property {number} salePrice - How much was the gun sold for - float
 * @property {string} saleDate - When was the gun sold - date
 * @property {string} picture - A picture of the fun - byte
 * @property {integer} userId.required - ID of the user that owns the gun
 */
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
    ffl: {
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
