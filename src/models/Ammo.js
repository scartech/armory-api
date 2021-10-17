const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

/**
 * Gun model
 * @typedef {object} Ammo
 * @property {integer} id.required - ID
 * @property {string} name - A user defined name
 * @property {string} brand - Manufacturer's brand name
 * @property {string} caliber - The caliber of the ammo. 9mm, .223, etc.
 * @property {string} weight - The ammo's grain weight
 * @property {string} bulletType - Bullet type
 * @property {string} muzzleVelocity - The ammo's muzzle velocity
 * @property {string} purchaseFrom - Who was the ammo purchased from
 * @property {number} purchasePrice - How much was paid for the gun - float
 * @property {string} purchaseDate - Purchase date - date
 * @property {number} roundCount - How many rounds were purchased
 * @property {number} pricePerRound - Cost per round
 * @property {integer} userId.required - ID of the user that owns the gun
 */
const Ammo = db.define(
  'Ammo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    brand: {
      type: DataTypes.STRING,
    },
    caliber: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.STRING,
    },
    bulletType: {
      type: DataTypes.STRING,
    },
    muzzleVelocity: {
      type: DataTypes.STRING,
    },
    purchasedFrom: {
      type: DataTypes.STRING,
    },
    purchasePrice: {
      type: DataTypes.DECIMAL,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
    },
    roundCount: {
      type: DataTypes.INTEGER,
    },
    pricePerRound: {
      type: DataTypes.DECIMAL,
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'ammo',
  },
);

module.exports = Ammo;
