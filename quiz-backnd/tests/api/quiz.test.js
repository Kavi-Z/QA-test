const request = require('supertest');
const app = require('../../index');
const User = require('../../models/User');

describe('Quiz API (TDD)', () => {
  let token;
  
  beforeAll(async () => {
    const testUser = {
      fullName: "teacher",
      email: "teacher@gmail.com", 
      password: "teacher",
      role: "teacher"
    };
    
    await User.deleteOne({ email: testUser.email });
    
 
    await request(app).post("/api/auth/signup").send(testUser);
    
  
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "teacher",
        role: testUser.role
      });
      
    token = loginRes.body.token;
  });

  it('should not allow creating a quiz with empty title', async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .set('Authorization', `Bearer ${token}`)   
      .send({ title: "" });
      
    expect(res.statusCode).toBe(400);
  });
});