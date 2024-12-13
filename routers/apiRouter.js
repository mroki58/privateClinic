const express = require('express');
const router = express.Router();


const getOddzialy = require('../controllers/controller');

// Definicja tras
router.get('/oddzial', getOddzialy); // Pobierz listę użytkowników

module.exports = router;