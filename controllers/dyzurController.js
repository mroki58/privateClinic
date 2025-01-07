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
        return res.status(500).send({ error: err.message, details: err.message });
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
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const postNewDyzur = async (req, res) => {
    try {
        const { data, zmiana_id } = req.body;
        const values = [data, zmiana_id];

        const result = await pool.query(`insert into dyzur(data, zmiana_id) VALUES ($1, $2)`, values);
        res.send({ error: 'Stworzono nowy dyzur' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
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
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

const getDyzury = async (req, res) => {
    try {
        const currentDate = new Date();

        let day = currentDate.getDate();       
        let month = currentDate.getMonth() + 1; 
        let year = currentDate.getFullYear();    

        if(day < 10)
        {
            day = `0${day}`
        }

        if (month < 10) {
            month = `0${month}`
        }

        const date1 = `${year}-${month}-${day}`

        query = `SELECT * FROM dyzur WHERE data >= '${date1}' ORDER BY data ASC, zmiana_id DESC`
        const result = await pool.query(query);
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

const changePracownikOnDyzur = async (req, res) => {
    try {
        const { data, zmiana_id, pracownik_id, nowy_pracownik_id  } = req.body;
        const values = [data, zmiana_id, pracownik_id, nowy_pracownik_id];

        const result = await pool.query(`UPDATE pracownik_dyzur SET pracownik_id = $4 WHERE dyzur_id = (SELECT dyzur_id FROM dyzur WHERE data = $1 AND zmiana_id = $2) AND pracownik_id = $3 RETURNING *`, values);
        res.send({ error: 'Zmieniono pracownika dla dyżuru' });
    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message });
    }
}

const deletePracownikFromDyzur = async (req, res) => {
    try {
        const { data, zmiana_id, pracownik_id } = req.body;
        const values = [data, zmiana_id ,pracownik_id];

        const result = await pool.query(`DELETE FROM pracownik_dyzur WHERE dyzur_id = (SELECT dyzur_id FROM dyzur WHERE data = $1 AND zmiana_id = $2) AND pracownik_id = $3 RETURNING *`, values);
        if(result.rowCount > 0)
            res.send({ error: 'Usunięto pracownika z dyżuru' });
        else
            res.send({ error: 'Nie było takiego pracownika na dyżurze' });

    }
    catch (err) {
        if (err.code === 'P0001') {
            return res.status(400).send({ error: err.message });
        }
        return res.status(500).send({ error: err.message, details: err.message });
    }
}

module.exports = {
    getForLekarz,
    getForPieleg,
    postNewDyzur,
    postNewPracownikOnDyzur,
    getDyzury,
    changePracownikOnDyzur,
    deletePracownikFromDyzur,
}