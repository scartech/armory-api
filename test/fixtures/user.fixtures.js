const faker = require('faker');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../../src/config/jwt.config').JWT_SECRET;

exports.createUser = async (name, email, password, admin, enabled) => {
  const hashedPassword = await User.hashPassword(password);
  return User.create({
    email,
    name,
    password: hashedPassword,
    admin,
    enabled,
  });
};

exports.createJWT = () => {
  const body = {
    id: faker.random.alphaNumeric(1),
    email: faker.internet.email(),
    name: faker.name.findName(),
  };

  return jwt.sign({ user: body }, JWT_SECRET);
};
