const request = require('supertest');
const app = require('../../index');
const mongoose = require('mongoose');
const User = require('../../models/User');

describe('Auth API - Teacher', () => {
  const testUser = {
    fullName: 'teacher',          
    email: 'teacher@gmail.com',       
    password: 'teacher',               
    role: 'teacher'                   
  };

  beforeAll(async () => {
    await User.deleteOne({ email: testUser.email });
    
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send(testUser);
    
    if (signupRes.statusCode !== 201) {
      console.log('Signup failed:', signupRes.body);
      throw new Error(`Signup failed: ${JSON.stringify(signupRes.body)}`);
    }
  });

  afterAll(async () => {
    await User.deleteOne({ email: testUser.email });
    await mongoose.connection.close();
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,        
        password: testUser.password,   
        role: testUser.role           
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: testUser.email,        
        password: 'wrongpassword',    
        role: testUser.role          
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials.');
  });
});