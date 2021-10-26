const faker = require('faker');

class GunFixtures {
  static async createGun(userId) {
    return await Gun.create({
      serialNumber: faker.hacker.verb(),
      name: faker.company.bsBuzz(),
      modelName: faker.commerce.product(),
      manufacturer: faker.company.companyName(),
      caliber: faker.random.alphaNumeric(3),
      type: 'Rifle',
      action: 'Semi',
      ffl: faker.company.companyName(),
      dealer: faker.company.companyName(),
      purchasePrice: faker.finance.amount(),
      purchaseDate: faker.date.past(),
      buyer: faker.name.findName(),
      salePrice: faker.finance.amount(),
      saleDate: faker.date.past(),
      country: faker.name.findName(),
      estimatedValue: faker.finance.amount(),
      notes: faker.company.companyName(),
      rating: faker.datatype.number(5),
      userId: userId,
    });
  }
}

module.exports = GunFixtures;
