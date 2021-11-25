const faker = require('faker');
const UserFixtures = require('./user.fixtures');
const GunFixtures = require('./gun.fixtures');
const { Gun } = require('../models');

class AccessoryFixtures {
  static async initDatabase(DB, count) {
    await DB.authenticate();
    await DB.sync({ force: true });

    const user = await UserFixtures.createUser(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(),
      'USER',
      true,
    );

    const guns = [];
    const accessories = [];

    for (let i = 0; i < count; i++) {
      const gun = await GunFixtures.createGun(user.id);
      guns.push(gun);
    }

    for (let i = 0; i < count; i++) {
      const accessory = await Accessory.create({
        userId: user.id,
        type: 'Sling',
        serialNumber: faker.random.alphaNumeric(10),
        modelName: faker.random.alphaNumeric(10),
        manufacturer: faker.random.alphaNumeric(10),
        count: faker.datatype.number(),
        notes: faker.lorem.paragraph(),
        country: faker.random.alphaNumeric(10),
        storageLocation: faker.random.alphaNumeric(10),
        purchasedFrom: faker.random.alphaNumeric(10),
        purchasePrice: faker.datatype.number(),
        purchaseDate: faker.date.past(),
        manufactureYear: faker.random.alphaNumeric(10),
      });

      for (let j = 0; j < count; j++) {
        const gun = await Gun.findByPk(guns[j].id);
        await accessory.addGun(gun);
      }

      try {
        const acc = await Accessory.findByPk(accessory.id, {
          include: [
            {
              model: Gun,
              as: 'guns',
            },
          ],
        });

        accessories.push(acc);
      } catch (error) {
        console.error(error);
      }
    }

    return accessories;
  }
}

module.exports = AccessoryFixtures;
