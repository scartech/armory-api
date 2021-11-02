const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * Ammo Inventory item model
 * @typedef {object} AmmoInventory
 * @property {integer} id.required - ID
 * @property {string} caliber - The ammo's caliber
 * @property {string} brand - The brand of ammo
 * @property {integer} count - Number of the item on hand
 * @property {integer} goal - Target number for an item
 * @property {integer} userId.required - ID of the user that owns the ammo
 */
const AmmoInventory = db.define(
  'AmmoInventory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    caliber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
    },
    goal: {
      type: DataTypes.INTEGER,
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'ammo_inventory',
    indexes: [
      {
        fields: ['caliber', 'brand', 'name', 'user_id'],
      },
    ],
  },
);

module.exports = AmmoInventory;
