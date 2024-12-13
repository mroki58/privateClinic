const express = require('express');
const dyzurRouter = express.Router();

const { getForLekarz,
        getForPieleg
    }
    = require('../controllers/dyzurController');


dyzurRouter.get('/lekarz', getForLekarz);
dyzurRouter.get('/pieleg', getForPieleg);


module.exports = dyzurRouter;