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
      totpEnabled: false,
      totpValidated: false,
      totpKey: faker.datatype.string(30),
    });
  }

  static createJWT() {
    const user = {
      id: 1,
      email: faker.internet.email(),
      name: faker.name.findName(),
      role: 'ADMIN',
    };

    return this.createJWTForUser(user);
  }

  static createUserJWT(userId) {
    const user = {
      id: userId ? userId : 1,
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
