History = require('./History');
HistoryInventory = require('./HistoryInventory');
Gun = require('./Gun');
User = require('./User');
Ammo = require('./Ammo');
AmmoInventory = require('./AmmoInventory');

// Create model associations
User.hasMany(Gun, {
  as: 'guns',
  foreignKey: {
    name: 'userId',
  },
});

Gun.belongsTo(User, {
  foreignKey: {
    name: 'userId',
  },
});

User.hasMany(History, {
  as: 'history',
  foreignKey: {
    name: 'userId',
  },
});

History.belongsTo(User, {
  foreignKey: {
    name: 'userId',
  },
});

History.belongsToMany(Gun, {
  as: 'guns',
  through: 'gun_history',
});

Gun.belongsToMany(History, {
  as: 'history',
  through: 'gun_history',
});

History.belongsToMany(AmmoInventory, {
  as: 'inventory',
  through: HistoryInventory,
});

AmmoInventory.belongsToMany(History, {
  as: 'history',
  through: HistoryInventory,
});

User.hasMany(Ammo, {
  as: 'ammo',
  foreignKey: {
    name: 'userId',
  },
});

Ammo.belongsTo(User, {
  foreignKey: {
    name: 'userId',
  },
});

AmmoInventory.hasMany(Ammo, {
  as: 'ammo',
  foreignKey: {
    name: 'inventoryId',
  },
});

Ammo.belongsTo(AmmoInventory, {
  foreignKey: {
    name: 'inventoryId',
  },
});

User.hasMany(AmmoInventory, {
  as: 'ammoInventory',
  foreignKey: {
    name: 'userId',
  },
});

AmmoInventory.belongsTo(User, {
  foreignKey: {
    name: 'userId',
  },
});

module.exports = {
  Gun,
  History,
  User,
  Ammo,
  AmmoInventory,
};
