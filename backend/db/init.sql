-- Ensure the database exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pern_auth_db') THEN
        CREATE DATABASE pern_auth_db;
    END IF;
END $$;

-- Connect to the database
\c pern_auth_db;

-- Ensure the users table exists
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
