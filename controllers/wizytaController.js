const pool = require('../model/model')

const getRodzaj = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.lekarz_dla_wizyty_view`);
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

const getLekarzForWizyta = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_wizyty_lekarze($1, $2)`, [req.query.data, req.query.nazwisko]);
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



module.exports = {
    getRodzaj,
    getLekarzForWizyta
}