const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../../../index'); 
let response;

Given('I am an authenticated user', function () {
   
  this.token = 'mock-valid-jwt';  
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
