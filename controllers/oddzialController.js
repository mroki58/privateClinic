const pool = require('../model/model')

const getOddzialy = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.oddzialy_view`);
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
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const getStatsForOddzial = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_oddzial_stats($1)`, [req.query.oddzial_id]);
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


const putOrdynator = async (req, res) => {
    try {
        const { pracownik_id, oddzial_id } = req.body;
        const values = [pracownik_id, oddzial_id];

        const result = await pool.query(`UPDATE oddzial SET ordynator = $1 WHERE oddzial_id = $2`, values);
        res.send({ error: 'Zmieniono ordynatora!' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const putOddzialowy = async (req, res) => {
    try {
        const { pracownik_id, oddzial_id } = req.body;
        const values = [pracownik_id, oddzial_id];

        const result = await pool.query(`UPDATE oddzial SET oddzialowy = $1 WHERE oddzial_id = $2`, values);
        res.send({ error: 'Zmieniono oddzialowego!' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}


const getKosztyForOddzialy = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM koszty_dla_oddzialow_view`);
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
    getOddzialy,
    postOddzial,
    getStatsForOddzial,
    putOrdynator,
    putOddzialowy,
    getKosztyForOddzialy,
};

