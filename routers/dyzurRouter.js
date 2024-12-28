const express = require('express');
const dyzurRouter = express.Router();

const { getForLekarz,
        getForPieleg,
        postNewDyzur,
        postNewPracownikOnDyzur,
        getDyzury,
        changePracownikOnDyzur,
        deletePracownikFromDyzur
    }
    = require('../controllers/dyzurController');


dyzurRouter.get('/lekarz', getForLekarz);
dyzurRouter.get('/pieleg', getForPieleg);
dyzurRouter.get('/', getDyzury);

dyzurRouter.post('/', postNewDyzur);
dyzurRouter.post('/dodaj', postNewPracownikOnDyzur);

dyzurRouter.put('/pracownik', changePracownikOnDyzur);
dyzurRouter.delete('/pracownik', deletePracownikFromDyzur);

module.exports = dyzurRouter;