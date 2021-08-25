const Gun = require('./Gun');
const User = require('./User');

// Create model associations
User.hasMany(Gun, { as: 'guns' });
Gun.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

db = {};
module.exports = db;
