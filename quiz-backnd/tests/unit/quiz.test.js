const request = require('supertest');
const app = require('../../index');
const mongoose = require('mongoose');
const User = require('../../models/User');

describe('Quiz API (TDD)', () => {
  let token;
  
  const testUser = {
    fullName: "Teacher User",
    email: "teacher@gmail.com",
    password: "teacher",
    role: "teacher"
  };

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz_test');
    
    // Clean up existing user
    await User.deleteOne({ email: testUser.email });
    
    // Signup
    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send(testUser);
    
    if (signupRes.statusCode !== 201) {
      throw new Error(`Signup failed: ${JSON.stringify(signupRes.body)}`);
    }
    
    // Login to get token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
        role: testUser.role
      });
      
    token = loginRes.body.token;
    
    if (!token) {
      throw new Error('Failed to get authentication token');
    }
  });

  afterAll(async () => {
    await User.deleteOne({ email: testUser.email });
    await mongoose.connection.close();
  });

  it('should not allow creating a quiz with empty title', async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .set('Authorization', `Bearer ${token}`)  // ← Add authentication header
      .send({ title: "" });
      
    expect(res.statusCode).toBe(400);
  });
});