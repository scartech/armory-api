const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { UserFixtures, GunFixtures, HistoryFixtures } = require('../../test');

const { DBConfig } = require('../../config');
require('../../models');

const NUM_USERS = 1;
let jwtToken;
let invalidUserJwtToken;
let users = [];
let guns = [];
let histories = [];

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
                const gunPromises = [];
                users = userData.map((x) => x.dataValues);

                users.map((user) => {
                  for (let i = 0; i < 10; i++) {
                    gunPromises.push(GunFixtures.createGun(user.id));
                  }

                  Promise.all(gunPromises).then((gunData) => {
                    guns = gunData.map((x) => x.dataValues);
                    const historyPromises = [];

                    guns.map((gun) => {
                      for (let i = 0; i < 10; i++) {
                        historyPromises.push(
                          HistoryFixtures.createHistory(gun.id),
                        );
                      }
                    });

                    Promise.all(historyPromises).then((historyData) => {
                      histories = historyData.map((x) => x.dataValues);

                      histories.map((history) => {
                        const g = guns.filter(
                          (gun) => gun.id === history.gunId,
                        );
                        g.forEach((gun) => (gun.history = [history]));
                      });

                      done();
                    });
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
    const gun = guns[7];
    const history = gun.history[0];

    const res = await request(app)
      .get(`/api/history/${gun.id}`)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(gun.userId)}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});

describe('GET /api/history/:gunId/:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/history/1/1').expect(401, done);
  });

  it('should return 404 on non-existent history', (done) => {
    request(app)
      .get('/api/history/888888/1')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/history/abc/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with history', async () => {
    const gun = guns[1];
    const history = gun.history[0];

    const res = await request(app)
      .get(`/api/history/${gun.id}/${history.id}`)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(gun.userId)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(history.id);
  });
});

describe('DELETE /api/history/:gunId/:id', () => {
  it('should require authentication', (done) => {
    request(app).delete('/api/guns/1/1').expect(401, done);
  });

  it('should return 404 for non-existent history', (done) => {
    request(app)
      .delete('/api/history/1/999999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .delete('/api/history/1/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should delete history', (done) => {
    const gun = guns[0];
    const history = gun.history[0];

    request(app)
      .delete(`/api/history/${gun.id}/${history.id}`)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(gun.userId)}`)
      .expect(200)
      .end(() => {
        histories.splice(0, 1);
        done();
      });
  });
});

describe('PUT /api/history/:gunId/:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/history/1/1').expect(401, done);
  });

  it('should return 404 for non-existent history', async () => {
    const history = histories[1];

    const values = {
      name: faker.company.bsBuzz(),
      narrative: faker.lorem.paragraph(),
      roundCount: faker.datatype.number(),
      type: 'Range Day',
      eventDate: faker.date.past(),
    };

    const res = await request(app)
      .put(`/api/history/1/99999`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('should update history', async () => {
    const gun = guns[3];
    const history = gun.history[0];

    const values = {
      name: faker.company.bsBuzz(),
      narrative: faker.lorem.paragraph(),
      roundCount: faker.datatype.number(),
      type: 'Range Day',
      eventDate: faker.date.past(),
    };

    const res = await request(app)
      .put(`/api/history/${gun.id}/${history.id}`)
      .send(values)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(gun.userId)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.name).toBe(values.name);
    expect(res.body.narrative).toBe(values.narrative);
    expect(res.body.roundCount).toBe(values.roundCount);
    expect(res.body.type).toBe(values.type);
  });
});

describe('POST /api/history/:gunId', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/history/1').expect(401, done);
  });

  it('should create history', (done) => {
    const gun = guns[4];

    const values = {
      name: faker.company.bsBuzz(),
      narrative: faker.lorem.paragraph(),
      roundCount: faker.datatype.number(),
      type: 'Range Day',
      eventDate: faker.date.past(),
    };

    request(app)
      .post(`/api/history/${gun.id}`)
      .send(values)
      .set('Authorization', `Bearer ${UserFixtures.createJWT(gun.userId)}`)
      .expect('Content-Type', /json/)
      .expect(201, done);
  });
});
