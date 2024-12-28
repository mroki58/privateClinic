const pool = require('../model/model')

const getLekarzForRodzaj = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.lekarz_dla_wizyty_view ORDER BY opis`);
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

const getLekarzForWizyta = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_wizyty_lekarze($1, $2)`, [req.query.data, req.query.nazwisko]);
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

const getRodzaj = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.rodzaj_wizyty_view ORDER BY opis`);
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

const postRodzaj =  async (req, res) => {
    try {
        const {opis, cena, oddzial_id} = req.body;
        const values = [opis, cena, oddzial_id]

        const result = await pool.query(`INSERT INTO rodzaj_wizyty(opis, cena, oddzial_id) VALUES ($1, $2, $3)`, values);
        res.send({error: "Nowy rodzaj wizyty dodany!"});
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const postNowaWizyta = async (req, res) => {
    try {
        const { pacjent_id, data, godzina, rodzaj_wizyty_id, lekarz_id } = req.body;
        const values = [pacjent_id, data, godzina, rodzaj_wizyty_id, lekarz_id]

        const result = await pool.query(`insert into wizyta(pacjent_id, data, godzina, rodzaj_wizyty_id, lekarz_id) values ($1, $2, $3, $4, $5)`, values);
        res.send({ error: "Wizyta została dodana!" });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }    
}

// wystarczy godzina i data aby usunąć wizytę
const deleteWizyta = async (req, res) => {
    try {
        const { data, godzina } = req.body;
        const values = [data, godzina]

        const result = await pool.query(`DELETE FROM wizyta WHERE data = $1 AND godzina = $2 RETURNING *`, values);
        if(result.rowCount > 0)
            res.send({ error: "Wizyta została usunięta!" });
        else
            res.send({ error: "Nie istniała wizyta o tej godzinie!!!" });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}


module.exports = {
    getLekarzForRodzaj,
    getLekarzForWizyta,
    getRodzaj,
    postRodzaj,
    postNowaWizyta,
    deleteWizyta
}