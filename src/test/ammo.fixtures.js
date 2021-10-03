const faker = require('faker');

class AmmoFixtures {
  static async createAmmo(userId) {
    return await Ammo.create({
      weight: faker.hacker.verb(),
      name: faker.company.bsBuzz(),
      brand: faker.commerce.product(),
      bulletType: faker.company.companyName(),
      caliber: faker.random.alphaNumeric(3),
      muzzleVelocity: faker.random.alphaNumeric(10),
      purchasedFrom: faker.company.companyName(),
      purchasePrice: faker.finance.amount(),
      purchaseDate: faker.date.past(),
      pricePerRound: faker.finance.amount(),
      roundCount: faker.datatype.number(),
      userId: userId,
    });
  }
}

module.exports = AmmoFixtures;
