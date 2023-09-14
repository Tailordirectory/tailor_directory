const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();
const get = require("./get");
const changeProfileType = require('./change-profile-type')

router.get("/permissions", asyncHandler(get));
router.post("/profile-type", asyncHandler(changeProfileType));

module.exports = router;
