const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const UserFixture = require('../../../test/fixtures/user.fixtures');
const GunFixture = require('../../../test/fixtures/gun.fixtures');

const db = require('../../config/db.config');
require('../../models');

const NUM_USERS = 10;
let jwtToken;
let users = [];
let guns = [];

// Authentication middlewares
require('../../config/auth.config');
app.use(passport.initialize());

beforeAll((done) => {
  db.authenticate()
    .then(() => {
      // For tests, tear down the entire DB and rebuild
      db.sync({ force: true })
        .then(() => {
          jwtToken = UserFixture.createJWT();
          let promises = [];
          try {
            for (let i = 0; i < NUM_USERS; i++) {
              promises.push(
                UserFixture.createUser(
                  faker.name.findName(),
                  faker.internet.email(),
                  faker.internet.password(),
                  false,
                  true,
                ),
              );
            }

            Promise.all(promises)
              .then((userData) => {
                const gunPromises = [];
                users = userData.map((x) => x.dataValues);

                users.map((user) => {
                  gunPromises.push(GunFixture.createGun(user.id));
                });

                Promise.all(gunPromises).then((gunData) => {
                  guns = gunData.map((x) => x.dataValues);
                  done();
                });
              })
              .catch((error) => {
                console.log(error.message);
                done();
              });
          } catch (error) {
            console.log(error.message);
            done();
          }
        })
        .catch((error) => {
          console.log(error.message);
          done();
        });
    })
    .catch((e) => {
      console.error('Unable to connect to the DB', e);
      done();
    });
});

afterAll((done) => {
  db.close().then(done).catch(done);
});

describe('GET /api/guns:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/guns/1').expect(401, done);
  });

  it('should return 404 on non-existent gun', (done) => {
    request(app)
      .get('/api/guns/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/guns/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with gun', async () => {
    const gun = guns[0];

    const res = await request(app)
      .get(`/api/guns/${gun.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(gun.id);
  });
});

describe('DELETE /api/guns:id', () => {
  it('should require authentication', (done) => {
    request(app).delete('/api/guns/1').expect(401, done);
  });

  it('should return 404 for non-existent user', (done) => {
    request(app)
      .delete('/api/guns/999999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .delete('/api/guns/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should delete gun', (done) => {
    request(app)
      .delete(`/api/guns/${guns[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .end(() => {
        guns.splice(0, 1);
        done();
      });
  });
});

describe('PUT /api/guns:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/guns/1').expect(401, done);
  });

  it('should return 404 for non-existent gun', (done) => {
    const gun = guns[1];

    const values = {
      serialNumber: faker.hacker.verb(),
      name: faker.company.bsBuzz(),
      modelName: faker.commerce.product(),
      manufacturer: faker.company.companyName(),
      caliber: faker.random.alphaNumeric(3),
      type: 'Rifle',
      action: 'Semi',
      dealer: faker.company.companyName(),
      purchasePrice: faker.finance.amount(),
      purchaseDate: faker.date.past(),
      buyer: faker.name.findName(),
      salePrice: faker.finance.amount(),
      saleDate: faker.date.past(),
    };

    request(app)
      .put(`/api/guns/99999`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should update gun', async () => {
    const gun = guns[1];

    const values = {
      serialNumber: faker.hacker.verb(),
      name: faker.company.bsBuzz(),
      modelName: faker.commerce.product(),
      manufacturer: faker.company.companyName(),
      caliber: faker.random.alphaNumeric(3),
      type: 'Rifle',
      action: 'Semi',
      dealer: faker.company.companyName(),
      purchasePrice: faker.finance.amount(),
      purchaseDate: faker.date.past(),
      buyer: faker.name.findName(),
      salePrice: faker.finance.amount(),
      saleDate: faker.date.past(),
    };

    const res = await request(app)
      .put(`/api/guns/${gun.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.serialNumber).toBe(values.serialNumber);
    expect(res.body.name).toBe(values.name);
    expect(res.body.modelName).toBe(values.modelName);
    expect(res.body.manufacturer).toBe(values.manufacturer);
    expect(res.body.caliber).toBe(values.caliber);
    expect(res.body.type).toBe(values.type);
    expect(res.body.action).toBe(values.action);
    expect(res.body.dealer).toBe(values.dealer);
    expect(res.body.purchasePrice).toBe(values.purchasePrice);
    expect(res.body.buyer).toBe(values.buyer);
    expect(res.body.salePrice).toBe(values.salePrice);
  });
});

describe('POST /api/guns:id', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/guns').expect(401, done);
  });

  it('should create gun', (done) => {
    const values = {
      serialNumber: faker.hacker.verb(),
      name: faker.company.bsBuzz(),
      modelName: faker.commerce.product(),
      manufacturer: faker.company.companyName(),
      caliber: faker.random.alphaNumeric(3),
      type: 'Rifle',
      action: 'Semi',
      dealer: faker.company.companyName(),
      purchasePrice: faker.finance.amount(),
      purchaseDate: faker.date.past(),
      buyer: faker.name.findName(),
      salePrice: faker.finance.amount(),
      saleDate: faker.date.past(),
    };

    request(app)
      .post('/api/guns/')
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(201, done);
  });
});
