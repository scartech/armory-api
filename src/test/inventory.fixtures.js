const faker = require('faker');

class InventoryFixtures {
  static async create(userId) {
    return await AmmoInventory.create({
      caliber: '9mm',
      brand: faker.company.bsBuzz(),
      name: faker.hacker.phrase(),
      userId: userId,
    });
  }
}

module.exports = InventoryFixtures;
