const express = require('express');
const wizytaRouter = express.Router();

const { 
    getRodzaj,
    getLekarzForWizyta
}
    = require('../controllers/wizytaController');


wizytaRouter.get('/', getRodzaj);
wizytaRouter.get('/lekarz', getLekarzForWizyta)
module.exports = wizytaRouter;