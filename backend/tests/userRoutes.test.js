const request = require("supertest");
const app = require("../server");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const testUser = {
  username: "testuser",
  password: "TestPassword123!",
  first_name: "Test",
  last_name: "User",
  dob: "1995-05-15",
  address: "123 Test Street",
  gender: "M",
  nric: "S1234567D"
};

let token; // Variable to store the JWT token

beforeAll(async () => {
  // Clean up database before testing
  await pool.query("DELETE FROM users WHERE username = $1", [testUser.username]);

  // Register test user
  await request(app)
    .post("/auth/register")
    .send(testUser)
    .expect(201);

  // Create JWT token for test
  token = jwt.sign({ user: testUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  // Clean up test user after tests
  await pool.query("DELETE FROM users WHERE username = $1", [testUser.username]);
  await pool.end(); // Close database connection
});

describe("GET /dashboard", () => {
    // integration test with authorisation middleware
    test("Should return user info if authenticated with cookie", async () => {
      const res = await request(app)
        .get("/dashboard")
        .set("Cookie", `token=${token}`);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("username", testUser.username);
      expect(res.body).toHaveProperty("first_name", testUser.first_name);
      expect(res.body).toHaveProperty("last_name", testUser.last_name);
      expect(res.body).not.toHaveProperty("password"); // Ensure password is not included
    });

});
  