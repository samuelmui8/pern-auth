const request = require("supertest");
const app = require("../server");

describe("Input Validation Middleware", () => {
  test("Should return 401 if required fields are missing for /register", async () => {
    const incompleteUser = {
      username: "testuser",
      password: "TestPassword123!",
      // Missing NRIC, first_name, etc.
    };

    const res = await request(app).post("/auth/register").send(incompleteUser);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Missing Input");
  });

  test("Should return 401 if NRIC is invalid for /register", async () => {
    const invalidNricUser = {
      username: "testuser",
      password: "TestPassword123!",
      nric: "1234567X", // Invalid NRIC
      first_name: "Test",
      last_name: "User",
      dob: "1995-05-15",
      address: "123 Test Street",
      gender: "M",
    };

    const res = await request(app).post("/auth/register").send(invalidNricUser);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid NRIC");
  });

  test("Should return 401 if required fields are missing for /login", async () => {
    const incompleteLoginUser = {
      username: "testuser",
      // Missing password
    };

    const res = await request(app)
      .post("/auth/login")
      .send(incompleteLoginUser);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Missing Input");
  });
});
