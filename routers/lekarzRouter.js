const express = require('express')
const lekarzRouter = express.Router()

const { getLekarz, getStats} = require('../controllers/lekarzController');

lekarzRouter.get('/', getLekarz);
lekarzRouter.get('/stats', getStats)

module.exports = lekarzRouter;
