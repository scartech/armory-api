const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * Accessory model
 * @typedef {object} Accessory
 * @property {integer} id.required - ID
 * @property {string} type - Accessory type
 * @property {string} notes - Text describing the event
 * @property {string} eventDate - The date of the event.
 * @property {string} location - Location of the event.
 */
const Accessory = db.define(
  'Accessory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
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
    magazineCapacity: {
      type: DataTypes.INTEGER,
    },
    count: {
      type: DataTypes.INTEGER,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    country: {
      type: DataTypes.STRING,
    },
    storageLocation: {
      type: DataTypes.STRING,
    },
    purchasedFrom: {
      type: DataTypes.STRING,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
    },
    pricePerItem: {
      type: DataTypes.FLOAT,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
    },
    manufactureYear: {
      type: DataTypes.STRING,
    },
    accessoryReceiptImage: {
      type: DataTypes.TEXT,
    },
    accessoryImage: {
      type: DataTypes.TEXT,
    },
    accessoryReceiptImageSize: {
      type: DataTypes.VIRTUAL,
    },
    accessoryImageSize: {
      type: DataTypes.VIRTUAL,
    },
    hasAccessoryReceiptRawImage: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.accessoryReceiptImageSize > 100;
      },
    },
    hasAccessoryRawImage: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.accessoryImageSize > 100;
      },
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'accessories',
  },
);

module.exports = Accessory;
