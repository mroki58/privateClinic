const express = require('express');
const dyzurRouter = express.Router();
const dyzurController = require('../controllers/dyzurController')


const { getForLekarz,
        getForPieleg
    }
    = require('../controllers/dyzurController');


dyzurRouter.get('/lekarz', getForLekarz);
dyzurRouter.get('/pieleg', getForPieleg);


module.exports = dyzurRouter;