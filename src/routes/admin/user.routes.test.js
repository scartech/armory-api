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

                jwtToken = UserFixtures.createJWT(users[users.length - 1].id);
                jwtUserToken = UserFixtures.createUserJWT(
                  users[users.length - 1].id,
                );
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

describe('GET /admin/users', () => {
  it('should require authentication', (done) => {
    request(app).get('/admin/users').expect(401, done);
  });

  it('should require admin role', (done) => {
    request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${jwtUserToken}`)
      .expect(403, done);
  });

  it('should respond with json array of users', async () => {
    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(NUM_USERS);
  });
});

describe('GET /admin/users:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/admin/users/1').expect(401, done);
  });

  it('should require admin role', (done) => {
    request(app)
      .get('/admin/users/1')
      .set('Authorization', `Bearer ${jwtUserToken}`)
      .expect(403, done);
  });

  it('should return 404 on non-existent user', (done) => {
    request(app)
      .get('/admin/users/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/admin/users/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with user', async () => {
    const user = users[0];

    const res = await request(app)
      .get(`/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(user.id);
  });
});

describe('DELETE /admin/users:id', () => {
  it('should require authentication', (done) => {
    request(app).delete('/admin/users/1').expect(401, done);
  });

  it('should require admin role', (done) => {
    request(app)
      .delete('/admin/users/1')
      .set('Authorization', `Bearer ${jwtUserToken}`)
      .expect(403, done);
  });

  it('should return 404 for non-existent user', (done) => {
    request(app)
      .delete('/admin/users/999999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .delete('/admin/users/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should delete user', (done) => {
    request(app)
      .delete(`/admin/users/${users[0].id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .end(() => {
        users.splice(0, 1);
        done();
      });
  });
});

describe('PUT /admin/users:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/admin/users/1').expect(401, done);
  });

  it('should require admin role', (done) => {
    request(app)
      .put('/admin/users/1')
      .set('Authorization', `Bearer ${jwtUserToken}`)
      .expect(403, done);
  });

  it('should return 404 for non-existent user', (done) => {
    const user = users[1];

    const email = faker.internet.email();
    const name = faker.name.findName();
    const enabled = !user.enabled;
    const role = 'USER';
    const updateUser = { email, name, enabled, role };

    request(app)
      .put(`/admin/users/99999`)
      .send(updateUser)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should update user', async () => {
    const user = users[1];

    const email = faker.internet.email();
    const name = faker.name.findName();
    const enabled = !user.enabled;
    const role = 'USER';
    const updateUser = { email, name, enabled, role };

    const res = await request(app)
      .put(`/admin/users/${user.id}`)
      .send(updateUser)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.email).toEqual(email);
    expect(res.body.name).toEqual(name);
    expect(res.body.enabled).toEqual(enabled);
    expect(res.body.role).toEqual(role);
  });
});

describe('PUT /admin/users:id/password', () => {
  it('should require authentication', (done) => {
    request(app).put('/admin/users/1/password').expect(401, done);
  });

  it('should require admin role', (done) => {
    request(app)
      .put('/admin/users/1/password')
      .set('Authorization', `Bearer ${jwtUserToken}`)
      .expect(403, done);
  });

  it('should return 404 for non-existent user', (done) => {
    const password = faker.internet.password();

    request(app)
      .put(`/admin/users/99999/password`)
      .send({ password })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should fail with no password', (done) => {
    const user = users[0];

    request(app)
      .put(`/admin/users/${user.id}/password`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(400, done);
  });

  it('should update password', (done) => {
    const user = users[0];
    const password = faker.internet.password();

    request(app)
      .put(`/admin/users/${user.id}/password`)
      .send({ password })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200, done);
  });
});

describe('POST /admin/users:id', () => {
  it('should require authentication', (done) => {
    request(app).post('/admin/users').expect(401, done);
  });

  it('should require admin role', (done) => {
    request(app)
      .post('/admin/users')
      .set('Authorization', `Bearer ${jwtUserToken}`)
      .expect(403, done);
  });

  it('should create user', (done) => {
    const email = faker.internet.email();
    const name = faker.name.findName();
    const enabled = true;
    const role = 'USER';
    const password = faker.internet.password();
    const user = { email, name, enabled, role, password };

    request(app)
      .post('/admin/users/')
      .send(user)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(201, done);
  });

  it('should return 400 with no email', (done) => {
    const name = faker.name.findName();
    const enabled = true;
    const role = 'USER';
    const password = faker.internet.password();
    const user = { name, enabled, role, password };

    request(app)
      .post('/admin/users/')
      .send(user)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should return 400 with no password', (done) => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const enabled = true;
    const role = 'USER';
    const user = { email, name, enabled, role };

    request(app)
      .post('/admin/users/')
      .send(user)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should return 409 with existing email address', (done) => {
    const email = users[0].email;
    const name = faker.name.findName();
    const enabled = true;
    const role = 'USER';
    const password = faker.internet.password();
    const user = { email, name, enabled, role, password };

    request(app)
      .post('/admin/users/')
      .send(user)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(409, done);
  });
});
