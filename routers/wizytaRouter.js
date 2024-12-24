const express = require('express');
const wizytaRouter = express.Router();

const { 
    getLekarzForRodzaj,
    getLekarzForWizyta,
    getRodzaj,
    postRodzaj,
    postNowaWizyta
}
    = require('../controllers/wizytaController');


wizytaRouter.get('/', getLekarzForRodzaj);
wizytaRouter.get('/lekarz', getLekarzForWizyta);
wizytaRouter.get('/rodzaj', getRodzaj);
wizytaRouter.post('/rodzaj', postRodzaj);
wizytaRouter.post('/nowa', postNowaWizyta);

module.exports = wizytaRouter;