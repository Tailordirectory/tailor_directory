const express = require('express');
const asyncHandler = require('express-async-handler');
const create = require('./create')
const deleteOne = require('./delete')
const getOne = require('./get-one')
const updateOne = require('./update')
const getMyReviews = require('./get-me')
const createReply = require('./create-reply')
const deleteReply = require('./delete-reply')
const updateReply = require('./update-reply')
const acceptRequest = require('./status-accept')
const declineRequest = require('./status-decline')

const router = express.Router();

router.post('/', asyncHandler(create))
router.get('/me', asyncHandler(getMyReviews))
router.post('/:id/reply', asyncHandler(createReply))
router.delete('/:id/reply/:replyId', asyncHandler(deleteReply))
router.patch('/:id/reply/:replyId', asyncHandler(updateReply))
router.post('/:id/accept', asyncHandler(acceptRequest))
router.post('/:id/decline', asyncHandler(declineRequest))
router.get('/:id', asyncHandler(getOne))
router.patch('/:id', asyncHandler(updateOne))
router.delete('/:id', asyncHandler(deleteOne))


module.exports = router;
