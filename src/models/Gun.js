const { DataTypes, Sequelize } = require('sequelize');
const db = require('../config/db.config');

/**
 * Gun model
 * @typedef {object} Gun
 * @property {integer} id.required - ID
 * @property {string} name - A user defined name
 * @property {string} serialNumber - Serial number
 * @property {string} modelName - The manufacturer's model name
 * @property {string} manufacturer - The gun's manufacturer
 * @property {string} caliber - The caliber of the gun. 9mm, .223, etc.
 * @property {string} type - Rifle, pistol, shotgun, etc.
 * @property {string} action - semi auto, revolver, etc.
 * @property {string} dealer - Who was the gun purchased from
 * @property {number} purchasePrice - How much was paid for the gun - float
 * @property {string} purchaseDate - Purchase date - date
 * @property {string} ffl - Who was the FFL used when purchasing the gun
 * @property {string} buyer - Who was the gun sold to
 * @property {number} salePrice - How much was the gun sold for - float
 * @property {string} saleDate - When was the gun sold - date
 * @property {string} backImage - URL or base64 image data of the front of the gun
 * @property {string} frontImage - URL or base64 image data of the back of the gun
 * @property {string} serialImage - URL or base64 image data of the serial number of the gun
 * @property {string} receiptImage - URL or base64 image data of the receipt for the gun
 * @property {number} rating - Rating for the gun (0 - 5 in 0.5 increments)
 * @property {number} estimatedValue - Estimated value of the gun
 * @property {string} country - The gun's country of origin
 * @property {string} notes - Notes concerning the gun
 * @property {integer} userId.required - ID of the user that owns the gun
 */
const Gun = db.define(
  'Gun',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    serialNumber: {
      type: DataTypes.STRING,
    },
    modelName: {
      type: DataTypes.STRING,
    },
    manufacturer: {
      type: DataTypes.STRING,
    },
    caliber: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    action: {
      type: DataTypes.STRING,
    },
    dealer: {
      type: DataTypes.STRING,
    },
    ffl: {
      type: DataTypes.STRING,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
    },
    purchaseDate: {
      type: DataTypes.DATEONLY,
    },
    estimatedValue: {
      type: DataTypes.FLOAT,
    },
    country: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    buyer: {
      type: DataTypes.STRING,
    },
    salePrice: {
      type: DataTypes.FLOAT,
    },
    saleDate: {
      type: DataTypes.DATEONLY,
    },
    frontImage: {
      type: DataTypes.TEXT,
    },
    backImage: {
      type: DataTypes.TEXT,
    },
    serialImage: {
      type: DataTypes.TEXT,
    },
    receiptImage: {
      type: DataTypes.TEXT,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    frontImageSize: {
      type: DataTypes.VIRTUAL,
    },
    backImageSize: {
      type: DataTypes.VIRTUAL,
    },
    serialImageSize: {
      type: DataTypes.VIRTUAL,
    },
    receiptImageSize: {
      type: DataTypes.VIRTUAL,
    },
    hasFrontRawImage: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.frontImageSize > 100;
      },
    },
    hasBackRawImage: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.backImageSize > 100;
      },
    },
    hasSerialRawImage: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.serialImageSize > 100;
      },
    },
    hasReceiptRawImage: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.receiptImageSize > 100;
      },
    },
  },
  {
    underscored: true,
    paranoid: true,
    tableName: 'guns',
    defaultScope: {
      attributes: {
        exclude: ['frontImage', 'backImage', 'serialImage', 'receiptImage'],
        include: [
          [
            Sequelize.fn('length', Sequelize.col('front_image')),
            'frontImageSize',
          ],
          [
            Sequelize.fn('length', Sequelize.col('back_image')),
            'backImageSize',
          ],
          [
            Sequelize.fn('length', Sequelize.col('serial_image')),
            'serialImageSize',
          ],
          [
            Sequelize.fn('length', Sequelize.col('receipt_image')),
            'receiptImageSize',
          ],
        ],
      },
    },
    scopes: {
      frontImage: {
        attributes: {
          include: ['frontImage'],
        },
      },
      backImage: {
        attributes: {
          include: ['backImage'],
        },
      },
      serialImage: {
        attributes: {
          include: ['serialImage'],
        },
      },
      receiptImage: {
        attributes: {
          include: ['receiptImage'],
        },
      },
      allImages: {
        attributes: {
          include: ['frontImage', 'backImage', 'serialImage', 'receiptImage'],
        },
      },
    },
  },
);

module.exports = Gun;
