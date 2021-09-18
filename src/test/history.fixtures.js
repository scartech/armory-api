const faker = require('faker');

class HistoryFixtures {
  static async createHistory(gunId) {
    return await History.create({
      name: faker.company.bsBuzz(),
      narrative: faker.lorem.paragraph(),
      roundCount: faker.datatype.number(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunId: gunId,
    });
  }
}

module.exports = HistoryFixtures;
