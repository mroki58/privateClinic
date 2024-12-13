const pool = require('../model/model')

const getOddzialy = async (req,res) => {
    try {
    const result = await pool.query(`
                SELECT 
                    o.nazwa, 
                    o.nr_budynku, 
                    CONCAT(p1.imie, ' ', p1.nazwisko) as ordynator,  
                    CONCAT(p2.imie, ' ', p2.nazwisko) as oddziałowy 
                FROM proj.oddzial o 
                JOIN proj.pracownik p1 ON p1.pracownik_id = o.ordynator 
                JOIN proj.pracownik p2 ON p2.pracownik_id = o.oddzialowy
                `);

    console.log(result)
    let rows = result.rows
    res.send(rows)
}
catch (err) {
    console.log(err)
    res.status(500).send({ msg: 'Nie udalo sie wykonac polecenia' })
}
}

module.exports = getOddzialy
