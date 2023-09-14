const express = require("express");
const asyncHandler = require("express-async-handler");
const create = require("./create");
const deleteOne = require("./delete");
const getByBiseness = require("./getByBusiness");
const updateOne = require("./update-one");
const getMyReviews = require("./get-me");
const checkIsExists = require("./check-is-exists");

const router = express.Router();

router.get("/business/is-exists/:id", asyncHandler(checkIsExists));
router.post("/business/:id", asyncHandler(create));
router.get("/me", asyncHandler(getMyReviews));
router.get("/business/:id", asyncHandler(getByBiseness));
router.patch("/:id", asyncHandler(updateOne));
router.delete("/:id", asyncHandler(deleteOne));

module.exports = router;
