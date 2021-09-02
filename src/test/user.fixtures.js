const faker = require('faker');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

class UserFixtures {
  static async createUser(name, email, password, role, enabled) {
    const hashedPassword = await User.hashPassword(password);
    return await User.create({
      email,
      name,
      password: hashedPassword,
      role,
      enabled,
    });
  }

  static createJWT() {
    const body = {
      id: 3,
      email: faker.internet.email(),
      name: faker.name.findName(),
      role: 'ADMIN',
    };

    return jwt.sign({ user: body }, JWT_SECRET);
  }

  static createUserJWT() {
    const body = {
      id: 2,
      email: faker.internet.email(),
      name: faker.name.findName(),
      role: 'USER',
    };

    return jwt.sign({ user: body }, JWT_SECRET);
  }
}

module.exports = UserFixtures;
