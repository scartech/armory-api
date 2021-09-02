const { ROLES, ClientMessage } = require('../utils');

class UserMiddlewares {
  static verifyAdminAccess(req, res, next) {
    if (!req.user) {
      return res.status(401).json(new ClientMessage(true, ['Unauthorized']));
    }

    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json(new ClientMessage(true, ['Forbidden']));
    }

    next();
  }
}

module.exports = UserMiddlewares;
