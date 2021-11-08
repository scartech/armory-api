const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const {
  UserFixtures,
  HistoryFixtures,
  GunFixtures,
  InventoryFixtures,
} = require('../../test');
const { HistoryService } = require('../../services');
const { User } = require('../../models');

const { DBConfig } = require('../../config');
require('../../models');

const BATCH_SIZE = 10;
let jwtToken;
let histories = [];

// Authentication middlewares
require('../../config/auth.config');
app.use(passport.initialize());

beforeAll(async () => {
  histories = await HistoryFixtures.initDatabase(DBConfig, BATCH_SIZE);
  const user = await User.findByPk(1);
  jwtToken = UserFixtures.createUserJWT(1);
});

afterAll((done) => {
  DBConfig.close().then(done).catch(done);
});

describe('GET /api/history/:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/history/1').expect(401, done);
  });

  it('should return 404 on non-existent history', (done) => {
    request(app)
      .get('/api/history/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/history/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with history', async () => {
    const res = await request(app)
      .get(`/api/history/${histories[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(histories[0].id);
  });
});

describe('GET /api/history/inventory/:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/history/inventory/1').expect(401, done);
  });

  it('should return 404 on non-existent inventory item', (done) => {
    request(app)
      .get('/api/history/inventory/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/history/inventory/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with history items for a single ammo inventory', async () => {
    const res = await request(app)
      .get(`/api/history/inventory/${histories[0].inventories[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(BATCH_SIZE);
  });
});

describe('GET /api/history/gun/:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/history/gun/1').expect(401, done);
  });

  it('should return 404 on non-existent gun history', (done) => {
    request(app)
      .get('/api/history/gun/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/history/gun/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with history items for a single gun', async () => {
    const res = await request(app)
      .get(`/api/history/gun/${histories[0].guns[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toEqual(BATCH_SIZE);
  });
});

describe('DELETE /api/history/:id', () => {
  it('should require authentication', (done) => {
    request(app).delete('/api/history/1').expect(401, done);
  });

  it('should return 404 for non-existent history', (done) => {
    request(app)
      .delete('/api/history/999999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .delete('/api/history/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should delete history', (done) => {
    request(app)
      .delete(`/api/history/${histories[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .end(() => {
        histories.splice(0, 1);
        done();
      });
  });
});

describe('PUT /api/history/:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/history/1').expect(401, done);
  });

  it('should return 404 for non-existent history', async () => {
    const history = histories[0];

    const values = {
      notes: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: histories[0].guns.map((gun) => gun.id),
    };

    const res = await request(app)
      .put(`/api/history/99999`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('should update history', async () => {
    const history = await HistoryService.read(histories[0].id);

    const values = {
      notes: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: histories[0].guns.map((gun) => gun.id),
      inventoryIds: histories[0].inventories.map((inv) => inv.id),
    };

    const res = await request(app)
      .put(`/api/history/${history.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.notes).toBe(values.notes);
    expect(res.body.location).toBe(values.location);
    expect(res.body.type).toBe(values.type);
    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
    expect(res.body.inventories.length).toEqual(values.inventoryIds.length);
  });

  it('should add guns to history', async () => {
    const history = await HistoryService.read(histories[0].id);

    const values = {
      notes: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: history.guns.map((gun) => gun.id),
      inventoryIds: history.inventories.map((inv) => inv.id),
    };

    const gun = await GunFixtures.createGun(history.userId);
    values.gunIds.push(gun.id);

    const res = await request(app)
      .put(`/api/history/${history.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
    expect(res.body.inventories.length).toEqual(values.inventoryIds.length);
  });

  it('should add ammo inventory to history', async () => {
    const history = await HistoryService.read(histories[0].id);

    const values = {
      notes: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: history.guns.map((gun) => gun.id),
      inventoryIds: history.inventories.map((inv) => inv.id),
    };

    const inventory = await InventoryFixtures.create(history.userId);
    values.inventoryIds.push(inventory.id);

    const res = await request(app)
      .put(`/api/history/${history.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(Array.isArray(res.body.inventories)).toBe(true);
    expect(res.body.inventories.length).toEqual(values.inventoryIds.length);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
  });

  it('should remove guns from history', async () => {
    const history = await HistoryService.read(histories[0].id);

    const values = {
      notes: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: history.guns.map((gun) => gun.id),
      inventoryIds: history.inventories.map((inv) => inv.id),
    };

    values.gunIds.pop();

    const res = await request(app)
      .put(`/api/history/${history.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
    expect(res.body.inventories.length).toEqual(values.inventoryIds.length);
  });

  it('should remove ammo inventory from history', async () => {
    const history = await HistoryService.read(histories[0].id);

    const values = {
      notes: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: history.guns.map((gun) => gun.id),
      inventoryIds: history.inventories.map((inv) => inv.id),
    };

    values.inventoryIds.pop();

    const res = await request(app)
      .put(`/api/history/${history.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(Array.isArray(res.body.inventories)).toBe(true);
    expect(res.body.inventories.length).toEqual(values.inventoryIds.length);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
  });
});

describe('POST /api/history/', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/history').expect(401, done);
  });

  it('should create history', async () => {
    const values = {
      notes: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: histories[0].guns.map((gun) => gun.id),
      inventoryIds: histories[0].inventories.map((inv) => inv.id),
    };

    const res = await request(app)
      .post('/api/history/')
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body.notes).toBe(values.notes);
    expect(res.body.location).toBe(values.location);
    expect(res.body.type).toBe(values.type);
    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
    expect(res.body.inventories.length).toEqual(values.inventoryIds.length);
  });
});

describe('GET /api/history/rangedays', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/history/rangedays').expect(401, done);
  });

  it('should respond with history items for range days', async () => {
    const res = await request(app)
      .get('/api/history/rangedays')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(1);
  });
});

describe('POST /api/history/rangeday', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/history/rangeday').expect(401, done);
  });

  it('should create range day history', async () => {
    const values = {
      notes: faker.lorem.paragraph(),
      location: faker.address.streetAddress(),
      eventDate: faker.date.past(),
      gunIds: histories[0].guns.map((gun) => gun.id),
      inventoryIds: histories[0].inventories.map((inv) => inv.id),
    };

    const res = await request(app)
      .post('/api/history/rangeday')
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body.notes).toBe(values.notes);
    expect(res.body.location).toBe(values.location);
    expect(res.body.type).toBe('Range Day');
    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
    expect(res.body.inventories.length).toEqual(values.inventoryIds.length);
  });
});
