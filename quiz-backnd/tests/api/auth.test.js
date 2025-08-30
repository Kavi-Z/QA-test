const request = require('supertest');
const app = require('../../index');

describe('Auth API - Teacher', () => {
  const testUser = {
    email: 'teacher@gmail.com',
    password: 'teacher',
    role: 'teacher'
  };

  beforeAll(async () => {
    await request(app).post('/api/auth/signup').send(testUser);
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ ...testUser, password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials.');
  });
});
