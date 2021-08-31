const faker = require('faker');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

class UserFixtures {
  static async createUser(name, email, password, admin, enabled) {
    const hashedPassword = await User.hashPassword(password);
    return await User.create({
      email,
      name,
      password: hashedPassword,
      admin,
      enabled,
    });
  }

  static createJWT() {
    const body = {
      id: 3,
      email: faker.internet.email(),
      name: faker.name.findName(),
    };

    return jwt.sign({ user: body }, JWT_SECRET);
  }
}

module.exports = UserFixtures;
