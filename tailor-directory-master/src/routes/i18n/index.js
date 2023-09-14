const express = require('express');
const asyncHandler = require('express-async-handler');

const en = require('./en')
const de = require('./de')

const router = express.Router();

router.get('/en', asyncHandler(en))
router.get('/de', asyncHandler(de))

module.exports = router;
