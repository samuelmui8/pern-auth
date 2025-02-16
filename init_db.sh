#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Set default values if environment variables are not set
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-pern_auth_db}
DB_PASSWORD=${DB_PASS:-password}
DB_HOST=${localhost}
DB_PORT=${DB_PORT:-5432}

echo "Creating database and users table..."

# Use PGPASSWORD to pass the password automatically
export PGPASSWORD="$DB_PASSWORD"

# Check if database exists
DB_EXISTS=$(psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

# If database does not exist, create it
if [ "$DB_EXISTS" != "1" ]; then
  psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d postgres -c "CREATE DATABASE \"$DB_NAME\";"
fi

# Connect to the new database and create the users table
psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" <<EOSQL
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
EOSQL

echo "Database and users table setup complete!"
