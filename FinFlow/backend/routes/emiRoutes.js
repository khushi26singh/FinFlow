const express = require('express');
const router = express.Router();
const { calculateEmi } = require('../controllers/emiController');

router.post('/calculate', calculateEmi);

module.exports = router;