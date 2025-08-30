const request = require("supertest");
const app = require("../../index");  

describe("Quiz API (TDD)", () => {
  it("should return 200 on root endpoint", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Quiz backend running");
  });

  it("should not allow creating a quiz with empty title", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .send({ title: "" });  
    expect(res.statusCode).toBe(400);  
  });
});
