const request = require('supertest');
const app = require('../../index');

let token;

beforeAll(async () => {
 
  await request(app).post('/api/auth/signup').send({
    email: 'teacher@gmail.com',
    password: 'teacher',
    role: 'teacher'
  });

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'teacher@gmail.com',
      password: 'teacher',
      role: 'teacher'
    });

  token = res.body.token;
  if (!token) throw new Error('Login failed, token not received');
});

describe('Quiz API - Teacher', () => {
  it('should create a new quiz with valid title', async () => {
    const res = await request(app)
      .post('/api/quizzes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Sample Quiz' });

    expect(res.statusCode).toBe(201);
    expect(res.body.quiz).toHaveProperty('title', 'Sample Quiz');
  });
it('should fail to create a quiz with empty title', async () => {
  const res = await request(app)
    .post('/api/quizzes')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: '' });

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty('message', 'Quiz title is required.');
});

it('should create a new quiz with valid title', async () => {
  const res = await request(app)
    .post('/api/quizzes')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Sample Quiz' });

  expect(res.statusCode).toBe(201);
  expect(res.body.quiz).toHaveProperty('title', 'Sample Quiz');
});


});
