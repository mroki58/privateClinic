const pool = require('../model/model');

const getForLekarz = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_dyzury_lekarze($1)`, [req.body.data]);
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

const getForPieleg = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_dyzury_pieleg($1)`, [req.body.data]);
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
    getForLekarz,
    getForPieleg
}