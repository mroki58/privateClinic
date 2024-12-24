const express = require('express')
const lekarzRouter = express.Router()

const { getLekarz, getStats, postLekarz} = require('../controllers/lekarzController');

lekarzRouter.get('/', getLekarz);
lekarzRouter.get('/stats', getStats);
lekarzRouter.post('/', postLekarz);

module.exports = lekarzRouter;
