const request = require("supertest");
const app = require("../server");
const pool = require("../config/db");

const testUser = {
  username: "testuser",
  password: "TestPassword123!",
  nric: "S1234567D",
  first_name: "Test",
  last_name: "User",
  dob: "1995-05-15",
  address: "123 Test Street",
  gender: "M",
};

beforeAll(async () => {
  // Clean up database before testing
  await pool.query("DELETE FROM users WHERE username = $1", [
    testUser.username,
  ]);

  // Register test user
  await request(app).post("/auth/register").send(testUser).expect(201); // Ensure registration is successful
});

afterAll(async () => {
  // Clean up test user after tests
  await pool.query("DELETE FROM users WHERE username = $1", [
    testUser.username,
  ]);
  await pool.query("DELETE FROM users WHERE username = $1", ["newuser"]);
  await pool.end(); // Close database connection
});

describe("Register", () => {
  // integration test with validation middleware
  test("Register should succeed with valid user data", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "newuser",
      password: "NewPassword123!",
      nric: "S7654321D",
      first_name: "New",
      last_name: "User",
      dob: "1995-05-15",
      address: "123 New Street",
      gender: "F",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

    test("Register should fail with existing username", async () => {
        const res = await request(app).post("/auth/register").send({
            username: testUser.username,
            password: "TestPassword123!",
            nric: "S1234567D",
            first_name: "Test",
            last_name: "User",
            dob: "1995-05-15",
            address: "123 Test Street",
            gender: "M",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Username already exists");
    });

    

    test("Register should fail with existing NRIC", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "newuser1",
            password: "NewPassword123!",
            nric: testUser.nric,
            first_name: "New",
            last_name: "User",
            dob: "1995-05-15",
            address: "123 New Street",
            gender: "F",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "NRIC already exists");
    });
});

describe("Login", () => {
  // integration test with validation middleware
  test("Login should succeed with correct credentials and set a cookie", async () => {
    const res = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    // Ensure that the cookie containing the JWT is set
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.headers["set-cookie"][0]).toMatch(/token/);
  });

  test("Login should fail with incorrect username", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "WrongUsername",
      password: testUser.password,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Invalid username");
  });

  test("Login should fail with incorrect password", async () => {
    const res = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: "WrongPassword123!",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Incorrect password");
  });
});

describe("Logout", () => {
    test("Logout should clear the cookie", async () => {
        const res = await request(app).post("/auth/logout");
    
        expect(res.statusCode).toBe(200);
        // Ensure that the cookie is cleared
        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.headers["set-cookie"][0]).toMatch(/token=;/);
    });
});

describe("GET /is-verified", () => {
    // integration test with authorisation middleware
    test("Should return true if authenticated with cookie", async () => {
        const loginRes = await request(app).post("/auth/login").send({
            username: testUser.username,
            password: testUser.password,
        });

        const cookie = loginRes.headers["set-cookie"][0];

        const res = await request(app)
            .get("/auth/is-verified")
            .set("Cookie", cookie);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe(true);
    });

    test("Should return false if not authenticated", async () => {
        const res = await request(app).get("/auth/is-verified");

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message", "Access denied");
    });
});
