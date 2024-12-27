const pool = require('../model/model');

const getForLekarz = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_dyzury_lekarze($1) ORDER BY zmiana desc`, [req.query.data]);
        let rows = result.rows
        res.send(rows)
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
}

const getForPieleg = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM proj.api_dyzury_pieleg($1) ORDER BY zmiana desc`, [req.query.data]);
        let rows = result.rows
        res.send(rows)
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
}

const postNewDyzur = async (req, res) => {
    try {
        const { data, zmiana } = req.body;
        const values = [data, zmiana];

        const result = await pool.query(`insert into dyzur(data, zmiana) VALUES ($1, $2)`, values);
        res.send({ error: 'Stworzono nowy dyzur' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
    
}

const postNewPracownikOnDyzur = async (req, res) => {
    try {
        const { dyzur_id, pracownik_id } = req.body;
        const values = [ dyzur_id, pracownik_id ];

        const result = await pool.query(`insert into pracownik_dyzur values ($1, $2)`, values);
        res.send({ error: 'Dodano pracownika do dyzuru' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
}

const getDyzury = async (req, res) => {
    try {
        const currentDate = new Date();

        const day = currentDate.getDate();       
        const month = currentDate.getMonth() + 1; 
        const year = currentDate.getFullYear();    

        if(day < 10)
        {
            day = `0${day}`
        }

        if (month < 10) {
            month = `0${month}`
        }

        const date1 = `${year}-${month}-${day}`

        query = `SELECT * FROM dyzur WHERE data >= '${date1}' ORDER BY data ASC, zmiana DESC`
        const result = await pool.query(query);
        let rows = result.rows
        res.send(rows)
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: 'Database error', details: err.message });
    }
}

module.exports = {
    getForLekarz,
    getForPieleg,
    postNewDyzur,
    postNewPracownikOnDyzur,
    getDyzury,
}