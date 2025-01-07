const pool = require('../model/model')

const getLekarz = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_get_lekarz($1)`, [req.query.oddzial]);
        let rows = result.rows
        res.send(rows)
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const getStats = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_wizyty_lekarze_stat($1, $2)`, [req.query.miesiac, req.query.rok]);
        let rows = result.rows
        res.send(rows)
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const postLekarz = async (req, res) => {
    try {

        const { imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id, specjalizacja_id } = req.body;
        const values = [imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id, specjalizacja_id];

        const result = await pool.query(`INSERT INTO proj.lekarz_insert_widok(imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id, specjalizacja_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, values);
        res.send({error: 'Dodano lekarza'});
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}


const getRodzajForLekarz = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_lekarz_rodzaj($1)`, [req.query.rw]);
        let rows = result.rows
        res.send(rows)
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const getSpecjalizacja = async(req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM specjalizacja`);
        let rows = result.rows
        res.send(rows)
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const postSpecjalizacja = async(req, res) => {
    try {
        values = [req.body.opis]; 
        const result = await pool.query(`INSERT INTO specjalizacja(opis) VALUES ($1)`, values);
        res.send({ error: 'Dodano specjalizacje' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

module.exports = {getLekarz,
                  getStats,
                  postLekarz,
                  getRodzajForLekarz, 
                  getSpecjalizacja,
                  postSpecjalizacja
                }