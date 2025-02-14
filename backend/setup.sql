CREATE DATABASE pern_auth_db;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    nric VARCHAR(9) UNIQUE NOT NULL CHECK (nric ~* '^[STFGM]\d{7}[A-Z]$'),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    gender char NOT NULL CHECK (gender IN ('M', 'F'))
);

-- insert some dummy data
---INSERT INTO users (nric, username, password, first_name, last_name, 
---dob, address, gender) VALUES ('S1234567A', 'johntan123', 'password123', 'John', 
---'Tan', '1990-01-01', '123, Jurong East Ave 1, #01-01, 600123', 'M');