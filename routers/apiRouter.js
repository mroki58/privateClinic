const express = require('express');
const router = express.Router();
const dyzurRouter = require('./dyzurRouter')
const wizytaRouter = require('./wizytaRouter')
const lekarzRouter = require('./lekarzRouter')


const { getOddzialy, 
        getPacjenci,
        getPieleg,
        postPieleg,
        postOddzial} 
        = require('../controllers/controller');


router.get('/oddzial', getOddzialy); 
router.post('/oddzial', postOddzial);

router.get('/pacjent', getPacjenci);

router.get('/pieleg', getPieleg);
router.post('/pieleg', postPieleg);

router.use('/lekarz', lekarzRouter);
router.use('/wizyta', wizytaRouter);
router.use('/dyzur', dyzurRouter);


module.exports = router;