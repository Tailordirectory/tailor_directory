const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();
const getClaims = require("./get");
const accept = require("./accept");
const decline = require("./decline");
const reply = require("./reply");

router.get("/", asyncHandler(getClaims));
router.post("/accept/:id", asyncHandler(accept));
router.post("/decline/:id", asyncHandler(decline));
router.post("/reply/:id", asyncHandler(reply));

module.exports = router;
