require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('auth routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('can sign up user via POST', () => {
    return request(app)
      .post(`/api/v1/auth/signup`)
      .send({
        email: 'test@gmail.com',
        password: 'testpw'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          email: 'test@gmail.com'
        });
      });
  });

  it('logs in an user via POST', async() => {
    const user = await User.create({
      email: 'test@gmail.com',
      password: 'testpw'
    });

    return request(app)
      .post(`/api/v1/auth/login`)
      .send({
        email: 'test@gmail.com',
        password: 'testpw'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          email: user.email
        });
      });
  });
});
