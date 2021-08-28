const express = require('express');
const app = require('./server');
const supertest = require('supertest');

app.use(express.text());

test('GET / should return "Armory API"', async () => {
  await supertest(app).get('/').expect(200).expect('Armory API');
});
