const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const get = require('./get');
const create = require('./create');
const update = require('./update');
const deleteOne = require('./delete');

router.get('/', asyncHandler(get));
router.post('/', asyncHandler(create));
router.patch('/:id', asyncHandler(update));
router.delete('/:id', asyncHandler(deleteOne));

module.exports = router;
