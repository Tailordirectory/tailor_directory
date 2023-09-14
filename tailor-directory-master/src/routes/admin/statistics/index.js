const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();
const profileTypes = require("./register-statistic");
const createdBy = require("./created-by-stats");

router.get("/profile-types", asyncHandler(profileTypes));
router.get("/created-by", asyncHandler(createdBy));

module.exports = router;
