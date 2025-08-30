
const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../../../index');
const User = require('../../../models/User');
let response;

Given('I am an authenticated user', async function () {
  const testUser = {
    name: "teacher",
    email: "teacher@gmail.com",
    password: "teacher",
    confirmPassword: "teacher",
    role: "teacher",
  };
  await User.deleteOne({ email: testUser.email });
  await request(app).post('/api/auth/signup').send(testUser);
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: testUser.email, password: testUser.password });
  this.token = res.body.token;
});

When('I create a quiz with title {string}', async function (title) {
  response = await request(app)
    .post('/api/quizzes')
    .set('Authorization', `Bearer ${this.token}`)
    .send({ title });
});

Then('I should receive a success response', function () {
  if (response.statusCode !== 201) {
    throw new Error(`Expected 201 but got ${response.statusCode}`);
  }
});
