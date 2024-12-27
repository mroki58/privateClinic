const express = require('express');
const dyzurRouter = express.Router();

const { getForLekarz,
        getForPieleg,
        postNewDyzur,
        postNewPracownikOnDyzur,
        getDyzury,
    }
    = require('../controllers/dyzurController');


dyzurRouter.get('/lekarz', getForLekarz);
dyzurRouter.get('/pieleg', getForPieleg);
dyzurRouter.get('/', getDyzury);

dyzurRouter.post('/', postNewDyzur);
dyzurRouter.post('/dodaj', postNewPracownikOnDyzur);

module.exports = dyzurRouter;