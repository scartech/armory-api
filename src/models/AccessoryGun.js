const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * AccessoryGun model
 * @typedef {object} AccessoryGun
 * @property {integer} id.required - ID
 */
const AccessoryGun = db.define(
  'AccessoryGun',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    underscored: true,
    paranoid: false,
    timestamps: false,
    tableName: 'accessory_gun',
  },
);

module.exports = AccessoryGun;
