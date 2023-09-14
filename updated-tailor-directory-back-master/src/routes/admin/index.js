const express = require('express');

const router = express.Router();

const businessRoutes = require('./business');
const usersRoutes = require('./users');
const authRoutes = require('./auth');
const tagsRoutes = require('./tags');
const claimsRoutes = require('./claims');
const reviewRoutes = require('./reviews');
const profileRoutes = require('./profiles');
const statsRoutes = require('./statistics');
const businessTypes = require('./business-types');
const system = require('./system');

router.use('/business', businessRoutes);
router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/tags', tagsRoutes);
router.use('/claims', claimsRoutes);
router.use('/reviews', reviewRoutes);
router.use('/profiles', profileRoutes);
router.use('/stats', statsRoutes);
router.use('/business-types', businessTypes);
router.use('/system', system);

module.exports = router;
