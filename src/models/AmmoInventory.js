const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * Ammo Inventory item model
 * @typedef {object} AmmoInventory
 * @property {integer} id.required - ID
 * @property {string} caliber - The ammo's caliber
 * @property {string} brand - The brand of ammo
 * @property {integer} count - Number of the item on hand
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
    totalPurchased: {
      type: DataTypes.VIRTUAL,
      get() {
        let total = 0;

        if (this.ammo) {
          total += this.ammo.reduce(
            (value, { roundCount }) => value + roundCount,
            0,
          );
        }

        return total;
      },
    },
    totalPurchasePrice: {
      type: DataTypes.VIRTUAL,
      get() {
        let total = 0.0;

        if (this.ammo) {
          total += this.ammo.reduce(
            (value, { purchasePrice }) => value + parseFloat(purchasePrice),
            0,
          );
        }

        return total;
      },
    },
    totalShot: {
      type: DataTypes.VIRTUAL,
      get() {
        let total = 0;

        if (this.history) {
          const rangeDays = this.history.filter((x) => x.type === 'Range Day');
          const historyInventories = rangeDays.map((x) => x.HistoryInventory);
          if (historyInventories.length > 0) {
            total += historyInventories.reduce(
              (value, { roundCount }) => value + roundCount,
              0,
            );
          }
        }

        return total;
      },
    },
    count: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.totalPurchased - this.totalShot;
      },
      set(value) {
        throw new Error('Do not try setting the count value');
      },
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
