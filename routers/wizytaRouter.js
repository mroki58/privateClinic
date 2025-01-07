const express = require('express');
const wizytaRouter = express.Router();

const { 
    getLekarzForRodzaj,
    getLekarzForWizyta,
    getRodzaj,
    postRodzaj,
    postNowaWizyta,
    deleteWizyta,
}
    = require('../controllers/wizytaController');


wizytaRouter.get('/', getLekarzForRodzaj);
wizytaRouter.get('/lekarz', getLekarzForWizyta);
wizytaRouter.get('/rodzaj', getRodzaj);
wizytaRouter.post('/rodzaj', postRodzaj);
wizytaRouter.post('/nowa', postNowaWizyta);

wizytaRouter.delete('/', deleteWizyta);
module.exports = wizytaRouter;