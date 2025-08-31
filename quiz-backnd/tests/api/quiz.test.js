const request = require('supertest');
const app = require('../../index');
const mongoose = require('mongoose');

let token;



const User = require('../../models/User');
const Quiz = require('../../models/Quiz');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz_test');

  const testUser = {
    fullName: "teacher",   
    email: "teacher@gmail.com",
    password: "teacher",  
    confirmPassword: "teacher",
    role: "teacher",
  };
 
  await User.deleteOne({ email: testUser.email });
 
  const signupRes = await request(app)
    .post("/api/auth/signup")
    .send(testUser);

  if (signupRes.statusCode !== 201 && signupRes.statusCode !== 200) {
    throw new Error(`Signup failed: ${JSON.stringify(signupRes.body)}`);
  }
 
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: testUser.email, password: testUser.password });

  console.log("Login response:", res.body);  

  token = res.body.token;

  if (!token) throw new Error("Login failed, token not received");
});




afterAll(async () => {
 
  await Quiz.deleteMany({});
  await User.deleteOne({ email: "teacher@gmail.com" });
  await mongoose.connection.close();
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
});
