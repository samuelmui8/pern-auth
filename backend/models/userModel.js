const pool = require("../config/db");

const createUser = async (username, hashedPassword, nric, firstName, lastName, dob, address, gender) => {
    const query = `INSERT INTO users (username, password, nric, first_name, last_name, dob, address, gender) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const values = [username, hashedPassword, nric, firstName, lastName, dob, address, gender];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getUserByNRIC = async (nric) => {
    const query = "SELECT * FROM users WHERE nric = $1";
    const result = await pool.query(query, [nric]);
    return result.rows[0];
};

const getUserByUsername = async (username) => {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);
    return result.rows[0];
};

module.exports = { createUser, getUserByNRIC, getUserByUsername };
