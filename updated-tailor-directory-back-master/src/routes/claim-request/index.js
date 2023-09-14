const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();
const create = require("./create");

router.post("/", asyncHandler(create));

module.exports = router;
