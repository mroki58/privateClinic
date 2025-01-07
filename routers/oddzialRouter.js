const express = require('express')
const oddzialRouter = express.Router()

const { getOddzialy,
    postOddzial,
    getStatsForOddzial,
    putOrdynator,
    putOddzialowy,
    getKosztyForOddzialy,
} = require('../controllers/oddzialController');


oddzialRouter.get('/', getOddzialy);
oddzialRouter.post('/', postOddzial);

oddzialRouter.put('/ordynator', putOrdynator);
oddzialRouter.put('/oddzialowy', putOddzialowy);


oddzialRouter.get('/stats', getStatsForOddzial);
oddzialRouter.get('/costs', getKosztyForOddzialy);

module.exports = oddzialRouter;