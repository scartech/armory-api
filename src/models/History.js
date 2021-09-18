const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * History model
 * @typedef {object} History
 * @property {integer} id.required - ID
 * @property {string} name - A user defined name
 * @property {string} type - History type - cleaning or range
 * @property {string} narrative - Text describing the event
 * @property {string} eventDate - The date of the event.
 * @property {integer} gunId.required - ID of the gun
 */
const History = db.define(
  'History',
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
    narrative: {
      type: DataTypes.TEXT,
    },
    roundCount: {
      type: DataTypes.INTEGER,
    },
    eventDate: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'history',
    defaultScope: {
      attributes: {
        exclude: ['gunId'],
      },
    },
  },
);

module.exports = History;
