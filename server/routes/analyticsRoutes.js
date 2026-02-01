const express = require('express');
const { getTopSellers } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/top-sellers', getTopSellers);

module.exports = router;
