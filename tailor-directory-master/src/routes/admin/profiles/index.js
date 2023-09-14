const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();
const get = require("./get");

router.get("/permissions", asyncHandler(get));

module.exports = router;
