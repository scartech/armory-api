const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { UserFixtures, AccessoryFixtures, GunFixtures } = require('../../test');
const { AccessoryService } = require('../../services');
const { User } = require('../../models');

const { DBConfig } = require('../../config');
require('../../models');

const BATCH_SIZE = 10;
let jwtToken;
let accessories = [];

// Authentication middlewares
require('../../config/auth.config');
app.use(passport.initialize());

beforeAll(async () => {
  accessories = await AccessoryFixtures.initDatabase(DBConfig, BATCH_SIZE);
  const user = await User.findByPk(1);
  jwtToken = UserFixtures.createUserJWT(1);
});

afterAll((done) => {
  DBConfig.close().then(done).catch(done);
});

describe('GET /api/accessory', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/accessory').expect(401, done);
  });

  it('should respond with empty array for a user with no accessories', async () => {
    const user = await UserFixtures.createUser(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(),
      'USER',
      true,
    );
    const jwt = UserFixtures.createJWTForUser(user);

    const res = await request(app)
      .get(`/api/accessory`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should respond with accessories', async () => {
    const res = await request(app)
      .get(`/api/accessory`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(BATCH_SIZE);
  });
});

describe('GET /api/accessory/:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/accessory/1').expect(401, done);
  });

  it('should return 404 on non-existent accessory', (done) => {
    request(app)
      .get('/api/accessory/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/accessory/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400, done);
  });

  it('should respond with accessory', async () => {
    const res = await request(app)
      .get(`/api/accessory/${accessories[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(accessories[0].id);
  });
});

describe('GET /api/accessory/gun/:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/accessory/gun/1').expect(401, done);
  });

  it('should return 404 on non-existent gun accessory', (done) => {
    request(app)
      .get('/api/accessory/gun/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/accessory/gun/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400, done);
  });

  it('should respond with accessories for a single gun', async () => {
    const res = await request(app)
      .get(`/api/accessory/gun/${accessories[0].guns[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(BATCH_SIZE);
  });
});

describe('DELETE /api/accessory/:id', () => {
  it('should require authentication', (done) => {
    request(app).delete('/api/accessory/1').expect(401, done);
  });

  it('should return 404 for non-existent accessory', (done) => {
    request(app)
      .delete('/api/accessory/999999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .delete('/api/accessory/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400, done);
  });

  it('should delete accessory', (done) => {
    request(app)
      .delete(`/api/accessory/${accessories[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .end(() => {
        accessories.splice(0, 1);
        done();
      });
  });
});

describe('PUT /api/accessory/:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/accessory/1').expect(401, done);
  });

  it('should return 404 for non-existent accessory', async () => {
    const accessory = accessories[0];

    const values = {
      type: 'Magazine',
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
      pricePerItem: faker.datatype.number(),
      magazineCapacity: faker.datatype.number(),
      gunIds: accessories[0].guns.map((gun) => gun.id),
    };

    const res = await request(app)
      .put(`/api/accessory/99999`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('should update accessory', async () => {
    const accessory = await AccessoryService.read(accessories[0].id);

    const values = {
      type: 'Magazine',
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
      pricePerItem: faker.datatype.number(),
      magazineCapacity: faker.datatype.number(),
      gunIds: accessories[0].guns.map((gun) => gun.id),
    };

    const res = await request(app)
      .put(`/api/accessory/${accessory.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.notes).toBe(values.notes);
    expect(res.body.storageLocation).toBe(values.storageLocation);
    expect(res.body.type).toBe(values.type);
    expect(res.body.serialNumber).toBe(values.serialNumber);
    expect(res.body.modelName).toBe(values.modelName);
    expect(res.body.manufacturer).toBe(values.manufacturer);
    expect(res.body.count).toBe(values.count);
    expect(res.body.pricePerItem).toBe(values.pricePerItem);
    expect(res.body.magazineCapacity).toBe(values.magazineCapacity);
    expect(res.body.country).toBe(values.country);
    expect(res.body.purchasedFrom).toBe(values.purchasedFrom);
    expect(res.body.purchasePrice).toBe(values.purchasePrice);
    expect(res.body.manufactureYear).toBe(values.manufactureYear);
    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
  });

  it('should add guns to accessory', async () => {
    const accessory = await AccessoryService.read(accessories[0].id);

    const values = {
      type: 'Magazine',
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
      pricePerItem: faker.datatype.number(),
      magazineCapacity: faker.datatype.number(),
      gunIds: accessory.guns.map((gun) => gun.id),
    };

    const gun = await GunFixtures.createGun(accessory.userId);
    values.gunIds.push(gun.id);

    const res = await request(app)
      .put(`/api/accessory/${accessory.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
  });

  it('should remove guns from accessory', async () => {
    const accessory = await AccessoryService.read(accessories[0].id);

    const values = {
      type: 'Magazine',
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
      pricePerItem: faker.datatype.number(),
      magazineCapacity: faker.datatype.number(),
      gunIds: accessory.guns.map((gun) => gun.id),
    };

    values.gunIds.pop();

    const res = await request(app)
      .put(`/api/accessory/${accessory.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
  });
});

describe('POST /api/accessory/', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/accessory').expect(401, done);
  });

  it('should create accessory', async () => {
    const values = {
      type: 'Magazine',
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
      pricePerItem: faker.datatype.number(),
      magazineCapacity: faker.datatype.number(),
      gunIds: accessories[0].guns.map((gun) => gun.id),
    };

    const res = await request(app)
      .post('/api/accessory/')
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body.notes).toBe(values.notes);
    expect(res.body.storageLocation).toBe(values.storageLocation);
    expect(res.body.type).toBe(values.type);
    expect(res.body.serialNumber).toBe(values.serialNumber);
    expect(res.body.modelName).toBe(values.modelName);
    expect(res.body.manufacturer).toBe(values.manufacturer);
    expect(res.body.count).toBe(values.count);
    expect(res.body.pricePerItem).toBe(values.pricePerItem);
    expect(res.body.magazineCapacity).toBe(values.magazineCapacity);
    expect(res.body.country).toBe(values.country);
    expect(res.body.purchasedFrom).toBe(values.purchasedFrom);
    expect(res.body.purchasePrice).toBe(values.purchasePrice);
    expect(res.body.manufactureYear).toBe(values.manufactureYear);
    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
  });
});
