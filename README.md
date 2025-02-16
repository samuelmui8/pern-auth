# PERN Authentication Application

A simple user authentication system built with the **PERN stack** (PostgreSQL, Express, React (Vite), Node.js). This application supports user login and registration using JWT authentication, with password hashing and validation.

## Features
- ✅ Login page and registration with proper validation
- ✅ Dashboard page for authenticated users displaying personal information
- ✅ PostgreSQL database for data management
- ✅ Password hashing for secure storage of user credentials using bcrypt
- ✅ Environment variable management using `.env` file for sensitive information, such as JWT secret key
- ✅ Comprehensive unit and integration tests for backend API endpoints (92% Code Coverage) and frontend components
- ✅ Containerization using Docker for ease of depolyment and scalability
- ✅ Persistent data storage using Docker volumes


## Prerequisites
- **Docker**: Docker must be installed on your machine. If you don't have it, you can download it from [here](https://www.docker.com/products/docker-desktop)
- **PostgreSQL** (optional): If you want to run the backend tests, you need to have PostgreSQL installed on your machine, with psql configured in your PATH. You can download it from [here](https://www.postgresql.org/download/)

## Running the app
1. Clone the repository
```bash
git clone https://github.com/samuelmui8/pern-auth.git
```
2. Create a `.env` file in the root directory with the following content, changing *DB_PASS* to your postgres password and *JWT_SECRET* to a secret key of your choice:
```env
PORT=3000
DB_USER=postgres
DB_HOST=postgres
DB_NAME=pern_auth_db
DB_PASS=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

3. In the root directory, run the following command to build and run the Docker container:
```bash
docker-compose up --build
```

4. If you have built the Docker container before, you can run the following command instead to start the container:
```bash
docker-compose up
```

5. The app should be running on `http://localhost:5173`


## Testing
To run the tests, refer to the following instructions:

### Frontend tests:
In the `frontend` directory, run:
```bash
npm install --save-dev
npm run test
```

### Backend tests

First, set up PostgreSQL database for testing. If you have psql in your PATH, in the root directory, run:
```bash
chmod +x init_db.sh
./init_db.sh
```

If you don't have psql in your PATH, you can create the database manually. Instructions are at the bottom of the README.


Ensure that the `.env` file in the root directory is set up correctly. If you have already run the Docker container, you have to switch `DB_HOST` from `postgres` to `localhost`:
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pern_auth_db
DB_PASS=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

In the `backend` directory, run:
```bash
npm install --save-dev
npm run test
```

## Technical Decisions
### JWT storage location
The JWT token is stored as **cookies** in the browser. Although storing it in local storage is more convenient and easier to implement, cookies is a more secure method. It is protected from XSS attacks (not accessible by JavaScript) and the cookie is set with the `HttpOnly` and `Secure` (in production) flags, which prevents cross-site scripting attacks and ensures that the cookie is only sent over HTTPS. The cookie is also set with the `SameSite` attribute to prevent cross-site request forgery (CSRF) attacks.

### Database Schema
The database schema consists of a single table, `users`, which stores user information. The table has the following columns:
- `username`: The username of the user, which is unique and serves as the primary key
- `password`: The hashed password of the user
- `nric`: The NRIC of the user, which is unique and has a regex check to ensure it is in the correct format
- `first_name`: The first name of the user
- `last_name`: The last name of the user
- `dob`: The date of birth of the user, which is a `Date` type in the past
- `address`: The address of the user
- `gender`: The gender of the user, which can be either 'M' or 'F'

Although `nric` is unique and would be a good candidate for the primary key, I chose to use `username` as the primary key because it is used directly during login to uniquely identify a user, and it is the hence the more logical choice.

### Password hashing
User passwords are hashed using the `bcrypt` library, which is a widely-used library for password hashing. The hashed password is stored in the database, and the original password is never stored. When a user logs in, the password entered is hashed and compared with the hashed password in the database. This ensures that the password is never stored in plaintext and is secure from attacks.

### Testing
The application is tested using **Jest**, **React Testing Library**, **Vitest**, **supertest** and **msw**.

The frontend unit tests ensure that components render correctly. They also ensure the correct behaviour of the components, such as form validation and user interaction, simulating API requests using **msw** to mock the API responses. The backend unit and integration tests the API endpoints and middleware. Integration tests help to test the interaction between the different API endpoints and the middleware and ensure that they work together correctly. The backend tests cover 92.24% of lines of code while the frontend tests cover all components.

## Data Management
The application uses a PostgreSQL database to store user data. The database is set up using Docker and is persistent, meaning that the data is not lost even when the container is stopped. To access the database, first run the Docker container:
```bash
docker-compose up
```

Next, open another terminal and connect to the PostgreSQL database using the following command:
```bash
docker exec -it postgres psql -U postgres -d pern_auth_db
```

You can now run SQL queries to interact with the database. For example, to view all the users in the `users` table, run:
```sql
SELECT * FROM users;
```

## Manual database setup for local testing
If you don't have psql in your PATH, you can create the database manually. First, ensure that you have PostgreSQL installed on your machine. Next, create the database and user using the following commands:

In your **psql** terminal, run:
```bash
CREATE DATABASE pern_auth_db;
```

Next, connect to the database and create the test table:
```bash
\c pern_auth_db

CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    nric VARCHAR(9) UNIQUE NOT NULL CHECK (nric ~* '^[STFGM]\d{7}[A-Z]$'),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    gender CHAR NOT NULL CHECK (gender IN ('M', 'F'))
);

```
