require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.db_user,
        password: process.env.db_pw,
        database: process.env.db_name
    },
    console.log('Connected to the employee database.')
);

module.exports = db;