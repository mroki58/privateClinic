const express = require('express');
const dyzurRouter = express.Router();

const { getForLekarz,
        getForPieleg,
        postNewDyzur,
        postNewPracownikOnDyzur,
    }
    = require('../controllers/dyzurController');


dyzurRouter.get('/lekarz', getForLekarz);
dyzurRouter.get('/pieleg', getForPieleg);

dyzurRouter.post('/', postNewDyzur);
dyzurRouter.post('/dodaj', postNewPracownikOnDyzur);

module.exports = dyzurRouter;