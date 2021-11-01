const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * Inventory item model
 * @typedef {object} Inventory
 * @property {integer} id.required - ID
 * @property {string} name - A user defined name
 * @property {string} type - The type of inventory item
 * @property {integer} count - Number of the item on hand
 * @property {integer} goal - Target number for an item
 * @property {integer} userId.required - ID of the user that owns the gun
 */
const Inventory = db.define(
  'Inventory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
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
    tableName: 'inventory',
  },
);

module.exports = Inventory;
