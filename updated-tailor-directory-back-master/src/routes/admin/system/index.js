const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const logoUpload = require('./logo-upload');

router.post('/logo', asyncHandler(logoUpload));

module.exports = router;
