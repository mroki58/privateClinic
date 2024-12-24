const pool = require('../model/model')

const getOddzialy = async (req,res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.oddzialy_view`);
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


const getPacjenci = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_get_pacjenci($1)`, [req.query.nazwisko]);
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


const getPieleg = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_get_pielegniarz($1)`, [req.query.oddzial]);
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

const postPieleg = async (req, res) => {
    try {

        const { imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id } = req.body;
        const values = [imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id];

        const result = await pool.query(`INSERT INTO proj.pielegniarz_insert_widok(imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, values);
        res.send({ error: 'Dodano pielegniarza' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
}

// dodanie nowego oddzialu na razie bez oddzialowego i odrynatora (musimy najpierw dodac lekarzy do oddzialu)
const postOddzial = async (req, res) => {
    try {

        const { nazwa, nr_budynku } = req.body;
        const values = [nazwa, nr_budynku];

        const result = await pool.query(`INSERT INTO oddzial(nazwa, nr_budynku) VALUES ($1, $2)`, values);
        res.send({ error: 'Dodano oddzial' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
}





module.exports = {  getOddzialy,
                    getPacjenci,
                    getPieleg,
                    postPieleg,
                    postOddzial };
