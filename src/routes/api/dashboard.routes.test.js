const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { UserFixtures, GunFixtures, AmmoFixtures } = require('../../test');

const { DBConfig } = require('../../config');
require('../../models');

const NUM_USERS = 10;
let jwtToken;
let invalidUserJwtToken;
let users = [];
let guns = [];
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
          invalidUserJwtToken = UserFixtures.createInvalidUserJWT();

          let promises = [];
          let ammoPromises = [];
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
                const gunPromises = [];
                users = userData.map((x) => x.dataValues);

                jwtToken = UserFixtures.createJWT(users[users.length - 1].id);

                users.map((user) => {
                  gunPromises.push(GunFixtures.createGun(user.id));
                });

                Promise.all(gunPromises).then((gunData) => {
                  guns = gunData.map((x) => x.dataValues);

                  users.map((user) => {
                    ammoPromises.push(AmmoFixtures.createAmmo(user.id));
                  });

                  Promise.all(ammoPromises).then((ammoData) => {
                    ammo = ammoData.map((x) => x.dataValues);
                    done();
                  });
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

describe('GET /api/dashboard', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/dashboard').expect(401, done);
  });

  it('should return 500 for non-existent user', async () => {
    const res = await request(app)
      .get(`/api/dashboard`)
      .set('Authorization', `Bearer ${invalidUserJwtToken}`)
      .expect(500);
  });

  it('should respond with 0 values for a user with no guns', async () => {
    const user = await UserFixtures.createUser(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(),
      'USER',
      true,
    );
    const jwt = UserFixtures.createJWTForUser(user);

    const res = await request(app)
      .get(`/api/dashboard`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.gunCount).toEqual(0);
    expect(res.body.totalGunCost).toEqual(0);
    expect(res.body.totalAmmoCost).toEqual(0);
  });

  it('should respond with dashboard data', async () => {
    const res = await request(app)
      .get(`/api/dashboard`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.gunCount).toBeGreaterThan(0);
    expect(res.body.totalGunCost).toBeGreaterThan(0);
    expect(res.body.totalAmmoCost).toBeGreaterThan(0);
  });
});
