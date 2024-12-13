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

module.exports = {getLekarz,
                  getStats 
                }