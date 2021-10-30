const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { UserFixtures } = require('../../test');

const { DBConfig } = require('../../config');
require('../../models');

const NUM_USERS = 10;
let jwtToken;
let jwtUserToken;
let users = [];

// Authentication middlewares
require('../../config/auth.config');
app.use(passport.initialize());

beforeAll((done) => {
  DBConfig.authenticate()
    .then(() => {
      // For tests, tear down the entire DB and rebuild
      DBConfig.sync({ force: true })
        .then(() => {
          jwtToken = UserFixtures.createJWT();
          jwtUserToken = UserFixtures.createUserJWT();
          let promises = [];
          try {
            for (let i = 0; i < NUM_USERS; i++) {
              promises.push(
                UserFixtures.createUser(
                  faker.name.findName(),
                  faker.internet.email(),
                  faker.internet.password(),
                  'ADMIN',
                  true,
                ),
              );
            }

            Promise.all(promises)
              .then((userData) => {
                users = userData.map((x) => x.dataValues);
                done();
              })
              .catch(() => done());
          } catch (error) {
            done();
          }
        })
        .catch((error) => {
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

describe('POST /api/profile/totpkey', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/profile/totp').expect(401, done);
  });

  it('should respond with a 32 digit key', async () => {
    const user = users[0];
    const userToken = UserFixtures.createJWTForUser(user);

    const res = await request(app)
      .post('/api/profile/totp')
      .set('Authorization', `Bearer ${userToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.totpKey).toHaveLength(32);
  });
});

describe('GET /api/profile', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/profile').expect(401, done);
  });

  it('should return 404 on non-existent user', (done) => {
    const invalidJwt = UserFixtures.createInvalidUserJWT();

    request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${invalidJwt}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should respond with user', async () => {
    const user = users[0];
    const userToken = UserFixtures.createJWTForUser(user);

    const res = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(user.id);
  });
});

describe('PUT /api/profile', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/profile').expect(401, done);
  });

  it('should return 404 on non-existent user', (done) => {
    const email = faker.internet.email();
    const name = faker.name.findName();
    const updateUser = { email, name };
    const invalidJwt = UserFixtures.createInvalidUserJWT();

    request(app)
      .put('/api/profile')
      .send(updateUser)
      .set('Authorization', `Bearer ${invalidJwt}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should update user', async () => {
    const user = users[1];

    const email = faker.internet.email();
    const name = faker.name.findName();
    const updateUser = { email, name };

    const res = await request(app)
      .put('/api/profile')
      .send(updateUser)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.email).toEqual(email);
    expect(res.body.name).toEqual(name);
  });
});

describe('PUT /api/profile/password', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/profilepassword').expect(401, done);
  });

  it('should return 404 for non-existent user', (done) => {
    const password = faker.internet.password();
    const invalidJwt = UserFixtures.createInvalidUserJWT();

    request(app)
      .put('/api/profile/password')
      .send({ password })
      .set('Authorization', `Bearer ${invalidJwt}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should fail with no password', (done) => {
    const user = users[0];

    request(app)
      .put('/api/profile/password')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400, done);
  });

  it('should update password', (done) => {
    const user = users[0];
    const userToken = UserFixtures.createJWTForUser(user);
    const password = faker.internet.password();

    request(app)
      .put('/api/profile/password')
      .send({ password })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200, done);
  });
});
