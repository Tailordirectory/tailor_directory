const express = require('express');
const asyncHandler = require('express-async-handler');

const { upload } = require('../../helpers/upload')

const router = express.Router();
const signUrl = require('./upload');

router.post('/upload', upload.single("file"), asyncHandler(signUrl));

module.exports = router;
