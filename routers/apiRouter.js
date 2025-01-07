const express = require('express');
const router = express.Router();
const dyzurRouter = require('./dyzurRouter')
const wizytaRouter = require('./wizytaRouter')
const lekarzRouter = require('./lekarzRouter')
const oddzialRouter = require('./oddzialRouter')


const {
        getPacjenci,
        getPieleg,
        postPieleg,
        postPacjent,
        getPracownicy,
} 
        = require('../controllers/controller');



router.get('/pacjent', getPacjenci);
router.post('/pacjent', postPacjent);

router.get('/pieleg', getPieleg);
router.post('/pieleg', postPieleg);

router.use('/lekarz', lekarzRouter);
router.use('/wizyta', wizytaRouter);
router.use('/dyzur', dyzurRouter);
router.use('/oddzial', oddzialRouter);

router.get('/pracownicy', getPracownicy)


module.exports = router;