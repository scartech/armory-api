const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { UserFixtures, GunFixtures } = require('../../test');

const { DBConfig } = require('../../config');
require('../../models');

const NUM_USERS = 1;
let jwtToken;
let invalidUserJwtToken;
let users = [];
let guns = [];

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
                  for (let j = 0; j < 10; j++) {
                    gunPromises.push(GunFixtures.createGun(user.id));
                  }
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
  DBConfig.close().then(done).catch(done);
});

describe('GET /api/guns', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/guns').expect(401, done);
  });

  it('should return an empty array for non-existent user', async () => {
    const res = await request(app)
      .get(`/api/guns`)
      .set('Authorization', `Bearer ${invalidUserJwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/guns/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with empty array for a user with no guns', async () => {
    const user = await UserFixtures.createUser(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(),
      'USER',
      true,
    );
    const jwt = UserFixtures.createJWTForUser(user);

    const res = await request(app)
      .get(`/api/guns`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should respond with guns', async () => {
    const res = await request(app)
      .get(`/api/guns`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(guns.length);
  });
});

describe('GET /api/guns/:id', () => {
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

describe('DELETE /api/guns/:id', () => {
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
      .delete(`/api/guns/${guns[guns.length - 1].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .end(() => {
        guns.splice(0, 1);
        done();
      });
  });
});

describe('PUT /api/guns/:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/guns/1').expect(401, done);
  });

  it('should return 404 for non-existent gun', (done) => {
    const gun = guns[0];

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
      country: faker.name.findName(),
      estimatedValue: faker.finance.amount(),
      notes: faker.company.companyName(),
    };

    request(app)
      .put(`/api/guns/99999`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should update gun', async () => {
    const gun = guns[0];

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
      country: faker.name.findName(),
      estimatedValue: faker.finance.amount(),
      notes: faker.company.companyName(),
      rating: faker.datatype.number(5),
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
    expect(res.body.country).toBe(values.country);
    expect(res.body.estimatedValue).toBe(values.estimatedValue);
    expect(res.body.notes).toBe(values.notes);
    expect(res.body.rating).toBe(values.rating);
  });
});

describe('POST /api/guns/:id', () => {
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
      country: faker.name.findName(),
      estimatedValue: faker.finance.amount(),
      notes: faker.company.companyName(),
      rating: faker.datatype.number(5),
    };

    request(app)
      .post('/api/guns/')
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(201, done);
  });
});

describe('PUT /api/guns/images/:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/guns/images/1').expect(401, done);
  });

  it('should return 404 for non-existent gun', (done) => {
    const gun = guns[1];

    const values = {
      frontImage:
        'https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image',
      backImage:
        'https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image',
      serialImage:
        'https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image',
    };

    request(app)
      .put(`/api/guns/images/99999`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should update gun', async () => {
    const gun = guns[1];

    const values = {
      frontImage:
        'https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image',
      backImage:
        'https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image',
      serialImage:
        'https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image',
    };

    const res = await request(app)
      .put(`/api/guns/images/${gun.id}`)
      .send(values)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
