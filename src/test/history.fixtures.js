const faker = require('faker');
const UserFixtures = require('./user.fixtures');
const GunFixtures = require('./gun.fixtures');
const InventoryFixtures = require('./inventory.fixtures');
const { Gun, AmmoInventory } = require('../models');

class HistoryFixtures {
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
    const inventories = [];
    const histories = [];

    for (let i = 0; i < count; i++) {
      const gun = await GunFixtures.createGun(user.id);
      guns.push(gun);
    }

    for (let i = 0; i < count; i++) {
      const inventory = await InventoryFixtures.create(user.id);
      inventories.push(inventory);
    }

    for (let i = 0; i < count; i++) {
      const history = await History.create({
        name: faker.company.bsBuzz(),
        narrative: faker.lorem.paragraph(),
        roundCount: faker.datatype.number(),
        type: 'Range Day',
        eventDate: faker.date.past(),
        userId: user.id,
      });

      for (let j = 0; j < count; j++) {
        const gun = await Gun.findByPk(guns[j].id);
        await history.addGun(gun);
      }

      for (let j = 0; j < count; j++) {
        const inventory = await AmmoInventory.findByPk(inventories[j].id);
        await history.addInventory(inventory);
      }

      const hist = await History.findByPk(history.id, {
        include: [
          {
            model: Gun,
            as: 'guns',
          },
          {
            model: AmmoInventory,
            as: 'inventory',
          },
        ],
      });
      histories.push(hist);
    }

    return histories;
  }
}

module.exports = HistoryFixtures;
