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
        const result = await pool.query(`
                SELECT 
                    o.nazwa, 
                    o.nr_budynku, 
                    CONCAT(p1.imie, ' ', p1.nazwisko) as ordynator,  
                    CONCAT(p2.imie, ' ', p2.nazwisko) as oddziałowy 
                FROM proj.oddzial o 
                JOIN proj.pracownik p1 ON p1.pracownik_id = o.ordynator 
                JOIN proj.pracownik p2 ON p2.pracownik_id = o.oddzialowy
                `);

        console.log(result)
        let rows = result.rows
        console.log(rows);
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