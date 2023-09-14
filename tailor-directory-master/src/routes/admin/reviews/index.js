const express = require("express");
const asyncHandler = require("express-async-handler");
const deleteOne = require("./delete");
const getByBiseness = require("./getByBusiness");
const updateOne = require("./update-one");
const get = require("./get");

const router = express.Router();

router.get("/", asyncHandler(get));
router.get("/business/:id", asyncHandler(getByBiseness));
router.patch("/:id", asyncHandler(updateOne));
router.delete("/:id", asyncHandler(deleteOne));

module.exports = router;
