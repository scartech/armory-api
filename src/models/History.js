const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * History model
 * @typedef {object} History
 * @property {integer} id.required - ID
 * @property {string} type - History type - cleaning or range
 * @property {string} notes - Text describing the event
 * @property {string} eventDate - The date of the event.
 * @property {string} location - Location of the event.
 */
const History = db.define(
  'History',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    eventDate: {
      type: DataTypes.DATEONLY,
    },
    ammoUsedCount: {
      type: DataTypes.VIRTUAL,
      get() {
        let total = 0;

        if (this.inventories) {
          this.inventories
            .filter((x) => x.HistoryInventory)
            .forEach((inv) => {
              total += inv.HistoryInventory.roundCount;
            });
        }

        return total;
      },
    },
    roundsShotCount: {
      type: DataTypes.VIRTUAL,
      get() {
        let total = 0;

        if (this.guns) {
          this.guns
            .filter((x) => x.HistoryGun)
            .forEach((inv) => {
              total += inv.HistoryGun.roundCount;
            });
        }

        return total;
      },
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'history',
  },
);

module.exports = History;
