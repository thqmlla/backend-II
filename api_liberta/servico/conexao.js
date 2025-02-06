import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'libertadores',
    password: 'liberta123',
    database: 'libertadores'
});

export default pool;