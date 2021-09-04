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
    const user = {
      id: 3,
      email: faker.internet.email(),
      name: faker.name.findName(),
      role: 'ADMIN',
    };

    return this.createJWTForUser(user);
  }

  static createUserJWT() {
    const user = {
      id: 2,
      email: faker.internet.email(),
      name: faker.name.findName(),
      role: 'USER',
    };

    return this.createJWTForUser(user);
  }

  static createInvalidUserJWT() {
    const user = {
      id: 99999,
      email: faker.internet.email(),
      name: faker.name.findName(),
      role: 'USER',
    };

    return this.createJWTForUser(user);
  }

  static createJWTForUser(user) {
    return jwt.sign({ user }, JWT_SECRET);
  }
}

module.exports = UserFixtures;
