History = require('./History');
Gun = require('./Gun');
User = require('./User');
Ammo = require('./Ammo');

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

Gun.hasMany(History, {
  as: 'history',
  foreignKey: {
    name: 'gunId',
  },
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

History.belongsTo(Gun, {
  foreignKey: {
    name: 'gunId',
  },
});

module.exports = {
  Gun,
  History,
  User,
  Ammo,
};
