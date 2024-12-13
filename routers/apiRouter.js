const express = require('express');
const router = express.Router();
const dyzurRouter = require('./dyzurRouter')


const { getOddzialy, 
        getPacjenci,
        getLekarze,
        getPieleg} 
        = require('../controllers/controller');


router.get('/oddzial', getOddzialy); 
router.get('/pacjent', getPacjenci);
router.get('/lekarz', getLekarze);
router.get('/pieleg', getPieleg);

router.use('/dyzur', dyzurRouter);

module.exports = router;