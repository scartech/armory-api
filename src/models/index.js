History = require('./History');
Gun = require('./Gun');
User = require('./User');

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

History.belongsTo(Gun, {
  foreignKey: {
    name: 'gunId',
  },
});

module.exports = {
  Gun,
  History,
  User,
};
