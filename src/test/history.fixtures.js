const faker = require('faker');
const UserFixtures = require('./user.fixtures');
const GunFixtures = require('./gun.fixtures');
const Gun = require('../models/Gun');

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
    const histories = [];

    for (let i = 0; i < count; i++) {
      const gun = await GunFixtures.createGun(user.id);
      guns.push(gun);
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

      const hist = await History.findByPk(history.id, {
        include: [
          {
            model: Gun,
            as: 'guns',
          },
        ],
      });
      histories.push(hist);
    }

    return histories;
  }
}

module.exports = HistoryFixtures;
