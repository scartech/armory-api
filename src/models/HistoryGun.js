const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * HistoryGun model
 * @typedef {object} HistoryGun
 * @property {integer} id.required - ID
 * @property {string} roundCount - The number of rounds used
 */
const HistoryGun = db.define(
  'HistoryGun',
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
    paranoid: false,
    timestamps: false,
    tableName: 'history_gun',
  },
);

module.exports = HistoryGun;
