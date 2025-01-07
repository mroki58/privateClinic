const pool = require('../model/model')


const getPacjenci = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_get_pacjenci($1)`, [req.query.nazwisko]);
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


const getPieleg = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_get_pielegniarz($1)`, [req.query.oddzial]);
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

const postPieleg = async (req, res) => {
    try {

        const { imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id } = req.body;
        const values = [imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id];

        const result = await pool.query(`INSERT INTO proj.pielegniarz_insert_widok(imie, nazwisko, plec, pesel, miejscowosc, ulica, nr_domu, nr_lokalu, pensja, wyksztalcenie, nr_telefonu, oddzial_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, values);
        res.send({ error: 'Dodano pielegniarza' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}


const postPacjent = async (req,res) => {
    try {
        const { imie, nazwisko, PESEL, miejscowosc, ulica, nr_domu, nr_lokalu, nr_telefonu } = req.body;
        const values = [imie, nazwisko, PESEL, miejscowosc, ulica, nr_domu, nr_lokalu, nr_telefonu];

        const result = await pool.query(`insert into pacjent(imie, nazwisko, PESEL, miejscowosc, ulica, nr_domu, nr_lokalu, nr_telefonu) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, values);
        res.send({ error: 'Zarejestrowano pacjenta' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

// dodac jeszcze oddzial i czy lekarz czy pielegniarka
const getPracownicy = async (req, res) => {
    try {
        const result = await pool.query(`SELECT pracownik_id, CONCAT(imie,' ',nazwisko) AS imie_nazwisko, 
                    (CASE WHEN lekarz_id IS NOT NULL THEN 'Lekarz' WHEN pielegniarz_id IS NOT NULL THEN 'Pielegniarz' ELSE 'Inne' END) as typ,
                    (CASE WHEN lekarz_id IS NOT NULL THEN o1.nazwa WHEN pielegniarz_id IS NOT NULL THEN o2.nazwa ELSE 'Inne' END) as oddzial,
                    (CASE WHEN lekarz_id IS NOT NULL THEN o1.oddzial_id WHEN pielegniarz_id IS NOT NULL THEN o2.oddzial_id ELSE NULL END) as oddzial_id
                                FROM pracownik p
                                    LEFT JOIN lekarz l ON pracownik_id = lekarz_id
                                    LEFT JOIN pielegniarz pi ON pracownik_id = pielegniarz_id
                                    LEFT JOIN oddzial o1 ON l.oddzial_id = o1.oddzial_id
                                    LEFT JOIN oddzial o2 ON pi.oddzial_id = o2.oddzial_id`);
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


module.exports = { 
                    getPacjenci,
                    getPieleg,
                    postPieleg,
                    postPacjent,
                    getPracownicy,
                };
