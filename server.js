const express = require('express')
const { Pool } = require('pg');
require('dotenv').config()
const ejs = require('ejs')

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

app.get('/oddzial', async (req, res) => {

    try{
        const result = await pool.query('SELECT * FROM proj.oddzial')
        console.log(result)
        let rows = result.rows
        res.render('main', {rows: rows, msg: "ok"});
    }catch(err)
    {
        console.log(err);
        res.render('main', {msg : "err"})
    }
})


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Serwer dziala na porcie ${PORT}`)
})