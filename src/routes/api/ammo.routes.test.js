const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { UserFixtures, AmmoFixtures } = require('../../test');

const { DBConfig } = require('../../config');
require('../../models');

const NUM_USERS = 1;
let jwtToken;
let invalidUserJwtToken;
let users = [];
let ammo = [];

// Authentication middlewares
require('../../config/auth.config');
app.use(passport.initialize());

beforeAll((done) => {
  DBConfig.authenticate()
    .then(() => {
      // For tests, tear down the entire DB and rebuild
      DBConfig.sync({ force: true })
        .then(() => {
          jwtToken = UserFixtures.createUserJWT();
          invalidUserJwtToken = UserFixtures.createInvalidUserJWT();

          let promises = [];
          try {
            for (let i = 0; i < NUM_USERS; i++) {
              promises.push(
                UserFixtures.createUser(
                  faker.name.findName(),
                  faker.internet.email(),
                  faker.internet.password(),
                  'USER',
                  true,
                ),
              );
            }

            Promise.all(promises)
              .then((userData) => {
                const ammoPromises = [];
                users = userData.map((x) => x.dataValues);

                users.map((user) => {
                  for (let i = 0; i < 10; i++) {
                    ammoPromises.push(AmmoFixtures.createAmmo(user.id));
                  }
                });

                Promise.all(ammoPromises).then((ammoData) => {
                  ammo = ammoData.map((x) => x.dataValues);
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
  DBConfig.close().then(done).catch(done);
});

describe('GET /api/ammo', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/ammo').expect(401, done);
  });

  it('should return an empty array for non-existent user', async () => {
    const res = await request(app)
      .get(`/api/ammo`)
      .set('Authorization', `Bearer ${invalidUserJwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/ammo/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with empty array for a user with no ammo', async () => {
    const user = await UserFixtures.createUser(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(),
      'USER',
      true,
    );
    const jwt = UserFixtures.createJWTForUser(user);

    const res = await request(app)
      .get(`/api/ammo`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should respond with ammo', async () => {
    const res = await request(app)
      .get(`/api/ammo`)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(ammo[2].userId)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(10);
  });
});

describe('GET /api/ammo/:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/ammo/1').expect(401, done);
  });

  it('should return 404 on non-existent ammo', (done) => {
    request(app)
      .get('/api/ammo/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/ammo/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with ammo', async () => {
    const theAmmo = ammo[3];

    const res = await request(app)
      .get(`/api/ammo/${theAmmo.id}`)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(theAmmo.userId)}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(theAmmo.id);
  });
});

describe('DELETE /api/ammo/:id', () => {
  it('should require authentication', (done) => {
    request(app).delete('/api/ammo/1').expect(401, done);
  });

  it('should return 404 for non-existent user', (done) => {
    request(app)
      .delete('/api/ammo/999999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .delete('/api/ammo/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should delete ammo', (done) => {
    request(app)
      .delete(`/api/ammo/${ammo[2].id}`)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(ammo[2].userId)}`)
      .expect(200)
      .end(() => {
        ammo.splice(0, 1);
        done();
      });
  });
});

describe('PUT /api/ammo/:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/ammo/1').expect(401, done);
  });

  it('should return 404 for non-existent ammo', (done) => {
    const theAmmo = ammo[1];

    const values = {
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
    };

    request(app)
      .put(`/api/ammo/99999`)
      .send(values)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(theAmmo.userId)}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should update ammo', async () => {
    const theAmmo = ammo[5];

    const values = {
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
    };

    const res = await request(app)
      .put(`/api/ammo/${theAmmo.id}`)
      .send(values)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(theAmmo.userId)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.weight).toBe(values.weight);
    expect(res.body.name).toBe(values.name);
    expect(res.body.brand).toBe(values.brand);
    expect(res.body.bulletType).toBe(values.bulletType);
    expect(res.body.caliber).toBe(values.caliber);
    expect(res.body.muzzleVelocity).toBe(values.muzzleVelocity);
    expect(res.body.purchasedFrom).toBe(values.purchasedFrom);
    expect(res.body.pricePerRound).toBe(values.pricePerRound);
    expect(res.body.purchasePrice).toBe(values.purchasePrice);
    expect(res.body.roundCount).toBe(values.roundCount);
  });
});

describe('POST /api/ammo/:id', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/ammo').expect(401, done);
  });

  it('should create ammo', (done) => {
    const values = {
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
    };

    request(app)
      .post('/api/ammo/')
      .send(values)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(ammo[3].userId)}`)
      .expect('Content-Type', /json/)
      .expect(201, done);
  });
});
