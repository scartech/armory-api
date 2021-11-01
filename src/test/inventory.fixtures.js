const faker = require('faker');

class InventoryFixtures {
  static async create(userId) {
    return await Inventory.create({
      name: faker.hacker.verb(),
      type: faker.company.bsBuzz(),
      count: faker.datatype.number(),
      goal: faker.datatype.number(),
      userId: userId,
    });
  }
}

module.exports = InventoryFixtures;
