const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const refreshToken = require("./refresh");

const authorize = require("./authorize.js");

router.post("/", asyncHandler(authorize));
router.post("/refresh", asyncHandler(refreshToken));

module.exports = router;
