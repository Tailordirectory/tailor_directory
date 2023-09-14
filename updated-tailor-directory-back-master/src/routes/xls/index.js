const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { upload } = require('../../helpers/upload')


const business = require('./business')
const uploadXls = require('./business-upload')

router.get('/business', asyncHandler(business))
router.post('/business', upload.single('file'), asyncHandler(uploadXls))

module.exports = router;
