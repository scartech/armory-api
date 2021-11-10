const faker = require('faker');
const passport = require('passport');
const request = require('supertest');
const app = require('../../server');
const { AmmoInventory, Ammo } = require('../../models');
const { UserFixtures, InventoryFixtures } = require('../../test');

const { DBConfig } = require('../../config');
const AmmoInventoryService = require('../../services/ammoinventory.service');
require('../../models');

const NUM_USERS = 1;
let jwtToken;
let invalidUserJwtToken;
let users = [];
let inventories = [];

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
                const inventoryPromises = [];
                users = userData.map((x) => x.dataValues);

                users.map((user) => {
                  for (let i = 0; i < 10; i++) {
                    inventoryPromises.push(InventoryFixtures.create(user.id));
                  }
                });

                Promise.all(inventoryPromises).then((inventoryData) => {
                  inventories = inventoryData.map((x) => x.dataValues);
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

describe('GET /api/inventory', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/inventory').expect(401, done);
  });

  it('should return an empty array for non-existent user', async () => {
    const res = await request(app)
      .get(`/api/inventory`)
      .set('Authorization', `Bearer ${invalidUserJwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/inventory/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with empty array for a user with no inventory', async () => {
    const user = await UserFixtures.createUser(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(),
      'USER',
      true,
    );
    const jwt = UserFixtures.createJWTForUser(user);

    const res = await request(app)
      .get(`/api/inventory`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should respond with inventory', async () => {
    const res = await request(app)
      .get(`/api/inventory`)
      .set(
        'Authorization',
        `Bearer ${UserFixtures.createJWT(inventories[2].userId)}`,
      )
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(10);
  });
});

describe('GET /api/inventory/caliber/:caliber', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/inventory/caliber/9mm').expect(401, done);
  });

  it('should return an empty array for non-existent user', async () => {
    const res = await request(app)
      .get(`/api/inventory/caliber/9mm`)
      .set('Authorization', `Bearer ${invalidUserJwtToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should respond with empty array for a user with no inventory', async () => {
    const user = await UserFixtures.createUser(
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(),
      'USER',
      true,
    );
    const jwt = UserFixtures.createJWTForUser(user);

    const res = await request(app)
      .get(`/api/inventory/caliber/inventories[2].caliber`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toEqual(0);
  });

  it('should respond with inventory', async () => {
    const res = await request(app)
      .get(`/api/inventory/caliber/${inventories[3].caliber}`)
      .set(
        'Authorization',
        `Bearer ${UserFixtures.createJWT(inventories[3].userId)}`,
      )
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body.length).toBeGreaterThan(1);
  });
});

describe('GET /api/inventory/:id', () => {
  it('should require authentication', (done) => {
    request(app).get('/api/inventory/1').expect(401, done);
  });

  it('should return 404 on non-existent inventory', (done) => {
    request(app)
      .get('/api/inventory/888888')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .get('/api/inventory/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should respond with inventory', async () => {
    const theInventory = inventories[3];

    const res = await request(app)
      .get(`/api/inventory/${theInventory.id}`)
      .set(
        'Authorization',
        `Bearer ${UserFixtures.createJWT(theInventory.userId)}`,
      )
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toBeDefined();
    expect(res.body.id).toEqual(theInventory.id);
  });
});

describe('DELETE /api/inventory/:id', () => {
  it('should require authentication', (done) => {
    request(app).delete('/api/inventory/1').expect(401, done);
  });

  it('should return 404 for non-existent user', (done) => {
    request(app)
      .delete('/api/inventory/999999')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404, done);
  });

  it('should return 400 on invalid ID type', (done) => {
    request(app)
      .delete('/api/inventory/abc')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should delete inventory', (done) => {
    request(app)
      .delete(`/api/inventory/${inventories[2].id}`)
      .set(
        'Authorization',
        `Bearer ${UserFixtures.createJWT(inventories[2].userId)}`,
      )
      .expect(200)
      .end(() => {
        inventories.splice(0, 1);
        done();
      });
  });

  it('should fail to delete inventory with count > 0', async () => {
    const brand = faker.company.companyName();
    const name = faker.commerce.product();
    const caliber = faker.hacker.verb();

    const inventory = await AmmoInventory.create({
      caliber,
      brand,
      goal: faker.datatype.number(),
      name,
      userId: inventories[0].userId,
    });

    const ammo = await Ammo.create({
      weight: faker.hacker.verb(),
      name,
      brand,
      bulletType: faker.company.companyName(),
      caliber,
      muzzleVelocity: faker.random.alphaNumeric(10),
      purchasedFrom: faker.company.companyName(),
      purchasePrice: faker.finance.amount(),
      purchaseDate: faker.date.past(),
      pricePerRound: faker.finance.amount(),
      roundCount: faker.datatype.number(),
      userId: inventories[0].userId,
      inventoryId: inventory.id,
    });

    await request(app)
      .delete(`/api/inventory/${inventory.id}`)
      .set(
        'Authorization',
        `Bearer ${UserFixtures.createJWT(inventory.userId)}`,
      )
      .expect(500);
  });
});

describe('PUT /api/inventory/:id', () => {
  it('should require authentication', (done) => {
    request(app).put('/api/inventory/1').expect(401, done);
  });

  it('should return 404 for non-existent inventory', (done) => {
    const theInventory = inventories[1];

    const values = {
      brand: faker.hacker.verb(),
      caliber: faker.company.bsBuzz(),
      goal: faker.datatype.number(),
      name: faker.hacker.verb(),
    };

    request(app)
      .put(`/api/inventory/99999`)
      .send(values)
      .set(
        'Authorization',
        `Bearer ${UserFixtures.createJWT(theInventory.userId)}`,
      )
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should update inventory', async () => {
    const theInventory = inventories[5];

    const values = {
      brand: faker.hacker.verb(),
      caliber: faker.company.bsBuzz(),
      goal: faker.datatype.number(),
      name: faker.hacker.verb(),
    };

    const res = await request(app)
      .put(`/api/inventory/${theInventory.id}`)
      .send(values)
      .set(
        'Authorization',
        `Bearer ${UserFixtures.createJWT(theInventory.userId)}`,
      )
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.caliber).toBe(values.caliber);
    expect(res.body.brand).toBe(values.brand);
    expect(res.body.name).toBe(values.name);
    expect(res.body.goal).toBe(values.goal);
  });
});

describe('POST /api/inventory/:id', () => {
  it('should require authentication', (done) => {
    request(app).post('/api/inventory').expect(401, done);
  });

  it('should create inventory', (done) => {
    const values = {
      brand: faker.hacker.verb(),
      name: faker.hacker.verb(),
      caliber: faker.company.bsBuzz(),
      goal: faker.datatype.number(),
    };

    request(app)
      .post('/api/inventory/')
      .send(values)
      .set(
        'Authorization',
        `Bearer ${UserFixtures.createJWT(inventories[3].userId)}`,
      )
      .expect('Content-Type', /json/)
      .expect(201, done);
  });
});
