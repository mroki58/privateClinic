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
        const result = await pool.query(`SELECT * FROM proj.api_get_pacjenci($1)`, [req.body.nazwisko]);
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

const getLekarze = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_get_lekarz($1)`, [req.body.oddzial]);
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
        const result = await pool.query(`SELECT * FROM proj.api_get_pielegniarz($1)`, [req.body.oddzial]);
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



module.exports = {  getOddzialy,
                    getPacjenci,
                    getLekarze,
                    getPieleg };
