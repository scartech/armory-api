const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { UserFixtures } = require('../../test');

const { DBConfig } = require('../../config');
require('../../models');

const password = faker.internet.password();
const email = faker.internet.email();

// Authentication middlewares
require('../../config/auth.config');
app.use(passport.initialize());

beforeAll((done) => {
  DBConfig.authenticate()
    .then(() => {
      // For tests, tear down the entire DB and rebuild
      DBConfig.sync({ force: true })
        .then(() => {
          try {
            UserFixtures.createUser(
              faker.name.findName(),
              email,
              password,
              'USER',
              true,
            ).then((userData) => {
              done();
            });
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

describe('POST /login', () => {
  it('should require email', (done) => {
    request(app).post('/login').send({ password }).expect(400, done);
  });

  it('should require password', (done) => {
    request(app).post('/login').send({ email }).expect(400, done);
  });

  it('should fail with valid email and invalid password', (done) => {
    request(app)
      .post('/login')
      .send({ email, password: faker.internet.password() })
      .expect(401, done);
  });

  it('should login with unknown email', (done) => {
    request(app)
      .post('/login')
      .send({ email: faker.internet.email(), password })
      .expect(401, done);
  });

  it('should login with incorrect email format', (done) => {
    request(app)
      .post('/login')
      .send({ email: faker.name.findName(), password })
      .expect(400, done);
  });

  it('should login with valid email and password', (done) => {
    request(app).post('/login').send({ email, password }).expect(200, done);
  });
});
