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
      type: DataTypes.VIRTUAL,
      get() {
        let total = 0;

        if (this.ammo) {
          total += this.ammo.reduce(
            (value, { roundCount }) => value + roundCount,
            0,
          );
        }

        if (this.history) {
          // console.log(this.history);
        }

        return total;
      },
      set(value) {
        throw new Error('Do not try setting the count value');
      },
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
