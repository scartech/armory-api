const faker = require('faker');

class InventoryFixtures {
  static async create(userId) {
    return await AmmoInventory.create({
      caliber: faker.hacker.verb(),
      brand: faker.company.bsBuzz(),
      goal: faker.datatype.number(),
      name: faker.hacker.phrase(),
      userId: userId,
    });
  }
}

module.exports = InventoryFixtures;
