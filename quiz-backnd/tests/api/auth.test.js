const request = require('supertest');
const app = require('../../index');

describe('Auth API - Teacher', () => {
  const testUser = {
    fullName: 'teacher',
    email: 'teacher@gmail.com',
    password: 'teacher',
    role: 'teacher'
  };

  beforeAll(async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    if (signupRes.statusCode !== 201) {
      console.log('Signup failed:', signupRes.body);
      throw new Error(`Signup failed: ${JSON.stringify(signupRes.body)}`);
    }
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: testUser.email, 
        password: 'wrongpass' 
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials.');
  });
});