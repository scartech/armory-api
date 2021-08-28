const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const UserFixture = require('../../../test/fixtures/user.fixtures');

const db = require('../../config/db.config');
require('../../models');

const NUM_USERS = 10;
let jwtToken;
let users = [];

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
  db.close().then(done).catch(done);
});

describe('GET /api/users', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/users').expect(401, done);
  });

  it('should respond with json array of users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(NUM_USERS);
  });
});

describe('GET /api/users:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/users/1').expect(401, done);
  });

  it('should respond with user', async () => {
    const user = users[0];

    const res = await request(app)
      .get('/api/users/' + user.id)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(user.id);
  });
});

describe('DELETE /api/users:id', () => {
  it('should require authentication', (done) => {
    request(app).delete('/api/users/1').expect(401, done);
  });

  it('should fail for non-existent user', async () => {
    const res = await request(app)
      .delete('/api/users/999999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  it('should delete user', async () => {
    const user = users[0];

    const res = await request(app)
      .delete('/api/users/' + user.id)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const delRes = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(delRes.body).toBeDefined();
    expect(Array.isArray(delRes.body)).toEqual(true);
    expect(delRes.body.length).toEqual(NUM_USERS - 1);

    // Remove the deleted user
    users.splice(0, 1);
  });
});

describe('PUT /api/users:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/users/1').expect(401, done);
  });

  it('should fail for non-existent user', async () => {
    const user = users[1];

    const email = faker.internet.email();
    const name = faker.name.findName();
    const enabled = !user.enabled;
    const admin = !user.admin;
    const updateUser = { email, name, enabled, admin };

    await request(app)
      .put(`/api/users/99999`)
      .send(updateUser)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  it('should update user', async () => {
    const user = users[1];

    const email = faker.internet.email();
    const name = faker.name.findName();
    const enabled = !user.enabled;
    const admin = !user.admin;
    const updateUser = { email, name, enabled, admin };

    await request(app)
      .put('/api/users/' + user.id)
      .send(updateUser)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });
});

describe('PUT /api/users:id/password', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/users/1/password').expect(401, done);
  });

  it('should fail for non-existent user', async () => {
    const password = faker.internet.password();

    await request(app)
      .put(`/api/users/99999/password`)
      .send({ password })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  it('should fail with no password', async () => {
    const user = users[0];

    await request(app)
      .put(`/api/users/${user.id}/password`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400);
  });

  it('should update password', async () => {
    const user = users[0];
    const password = faker.internet.password();

    await request(app)
      .put(`/api/users/${user.id}/password`)
      .send({ password })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });
});

describe('POST /api/users:id', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/users').expect(401, done);
  });

  it('should create user', async () => {
    const email = faker.internet.email();
    const name = faker.name.findName();
    const enabled = true;
    const admin = false;
    const password = faker.internet.password();
    const user = { email, name, enabled, admin, password };

    await request(app)
      .post('/api/users/')
      .send(user)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
  });

  it('should fail with no email', async () => {
    const name = faker.name.findName();
    const enabled = true;
    const admin = false;
    const password = faker.internet.password();
    const user = { name, enabled, admin, password };

    await request(app)
      .post('/api/users/')
      .send(user)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400);
  });

  it('should fail with no password', async () => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const enabled = true;
    const admin = false;
    const user = { email, name, enabled, admin };

    await request(app)
      .post('/api/users/')
      .send(user)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400);
  });

  it('should fail with existing email address', async () => {
    const email = users[0].email;
    const name = faker.name.findName();
    const enabled = true;
    const admin = false;
    const password = faker.internet.password();
    const user = { email, name, enabled, admin, password };

    await request(app)
      .post('/api/users/')
      .send(user)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(409);
  });
});
