const express = require('express')
const { Pool } = require('pg');
const path = require('path')
require('dotenv').config()


const app = express()

app.use(express.static('public'));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

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

app.get('/api/oddzial', async (req, res) => {

    try{
        const result = await client.query('SELECT * FROM proj.oddzial')
        res.send(result.rows);
    }catch(err)
    {
        res.send(JSON.stringify({"msg": "nie udalo sie pobrac rekordow"}))
    }
})


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serwer dziala na porcie ${PORT}`)
})