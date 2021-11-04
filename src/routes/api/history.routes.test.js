const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { UserFixtures, HistoryFixtures } = require('../../test');
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
      name: faker.company.bsBuzz(),
      narrative: faker.lorem.paragraph(),
      roundCount: faker.datatype.number(),
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
    const history = histories[0];

    const values = {
      name: faker.company.bsBuzz(),
      narrative: faker.lorem.paragraph(),
      roundCount: faker.datatype.number(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: histories[0].guns.map((gun) => gun.id),
    };

    const res = await request(app)
      .put(`/api/history/${history.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.name).toBe(values.name);
    expect(res.body.narrative).toBe(values.narrative);
    expect(res.body.roundCount).toBe(values.roundCount);
    expect(res.body.type).toBe(values.type);
    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
  });
});

describe('POST /api/history/', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/history').expect(401, done);
  });

  it('should create history', async () => {
    const values = {
      name: faker.company.bsBuzz(),
      narrative: faker.lorem.paragraph(),
      roundCount: faker.datatype.number(),
      type: 'Range Day',
      eventDate: faker.date.past(),
      gunIds: histories[0].guns.map((gun) => gun.id),
    };

    const res = await request(app)
      .post('/api/history/')
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body.name).toBe(values.name);
    expect(res.body.narrative).toBe(values.narrative);
    expect(res.body.roundCount).toBe(values.roundCount);
    expect(res.body.type).toBe(values.type);
    expect(Array.isArray(res.body.guns)).toBe(true);
    expect(res.body.guns.length).toEqual(values.gunIds.length);
  });
});
