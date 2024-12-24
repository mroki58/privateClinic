const express = require('express');
const wizytaRouter = express.Router();

const { 
    getLekarzForRodzaj,
    getLekarzForWizyta,
    getRodzaj
}
    = require('../controllers/wizytaController');


wizytaRouter.get('/', getLekarzForRodzaj);
wizytaRouter.get('/lekarz', getLekarzForWizyta)
wizytaRouter.get('/rodzaj', getRodzaj)
module.exports = wizytaRouter;