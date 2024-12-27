const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432,
    max: 10, // Liczba połączeń w puli
    idleTimeoutMillis: 30000, // Czas po którym nieaktywne połączenie zostaje zamknięte
    connectionTimeoutMillis: 2000, // Czas oczekiwania na nowe połączenie
});

pool.on('connect', (pool) => {
    pool.query('SET search_path TO proj');
    pool.query("SET timezone to 'Europe/Warsaw'")
});

module.exports = pool;