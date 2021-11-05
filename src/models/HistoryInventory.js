const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * HistoryInventory model
 * @typedef {object} HistoryInventory
 * @property {integer} id.required - ID
 * @property {string} roundCount - The number of rounds used
 */
const HistoryInventory = db.define(
  'HistoryInventory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roundCount: {
      type: DataTypes.INTEGER,
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'history_inventory',
  },
);

module.exports = HistoryInventory;
