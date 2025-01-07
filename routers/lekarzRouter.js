const express = require('express')
const lekarzRouter = express.Router()

const { getLekarz, getStats, postLekarz, getRodzajForLekarz, getSpecjalizacja, postSpecjalizacja,} = require('../controllers/lekarzController');

lekarzRouter.get('/', getLekarz);
lekarzRouter.get('/stats', getStats);
lekarzRouter.get('/rodzaj', getRodzajForLekarz)
lekarzRouter.post('/', postLekarz);

lekarzRouter.get('/spec', getSpecjalizacja);
lekarzRouter.post('/spec', postSpecjalizacja);


module.exports = lekarzRouter;
