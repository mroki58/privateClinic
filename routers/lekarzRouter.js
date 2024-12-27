const express = require('express')
const lekarzRouter = express.Router()

const { getLekarz, getStats, postLekarz, getRodzajForLekarz,} = require('../controllers/lekarzController');

lekarzRouter.get('/', getLekarz);
lekarzRouter.get('/stats', getStats);
lekarzRouter.get('/rodzaj', getRodzajForLekarz)
lekarzRouter.post('/', postLekarz);

module.exports = lekarzRouter;
