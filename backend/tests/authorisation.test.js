const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");

describe("authenticateToken Middleware", () => {
  let token;

  beforeAll(() => {
    // Create a valid token before tests
    token = jwt.sign({ user: "testuser" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  test("Should return 401 if no token is provided", async () => {
    const res = await request(app).get("/dashboard");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Access denied");
  });

  test("Should return 403 if an invalid token is provided", async () => {
    const res = await request(app)
      .get("/dashboard")
      .set("Cookie", "token=invalidtoken");

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });
});
