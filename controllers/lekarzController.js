const pool = require('../model/model')

const getLekarz = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_get_lekarz($1)`, [req.query.oddzial]);
        let rows = result.rows
        res.send(rows)
    }
    catch (err) {
        if (err.code === 'P0001') {
            res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
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
            res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
}

const postLekarz = async (req, res) => {
    try {

        const { imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id } = req.body;
        const values = [imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id];

        const result = await pool.query(`INSERT INTO proj.lekarz_insert_widok(imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, values);
        res.send({error: 'Dodano lekarza'});
    }
    catch (err) {
        if (err.code === 'P0001') {
            res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
}

module.exports = {getLekarz,
                  getStats,
                  postLekarz 
                }