const express = require('express');
const router = express.Router();
const dyzurRouter = require('./dyzurRouter')
const wizytaRouter = require('./wizytaRouter')
const lekarzRouter = require('./lekarzRouter')


const { getOddzialy, 
        getPacjenci,
        getPieleg} 
        = require('../controllers/controller');


router.get('/oddzial', getOddzialy); 
router.get('/pacjent', getPacjenci);
router.get('/pieleg', getPieleg);

router.use('/lekarz', lekarzRouter);
router.use('/wizyta', wizytaRouter);
router.use('/dyzur', dyzurRouter);

module.exports = router;