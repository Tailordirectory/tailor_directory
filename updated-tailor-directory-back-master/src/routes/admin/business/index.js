const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();

const create = require("./create.js");
const get = require("./get.js");
const getOne = require("./get-one.js");
const updateOne = require("./update-one.js");
const updateImage = require("./update-image");
const removeImage = require("./remove-image");
const icon = require("./icon");
const businessTypes = require("./get-business-types");
const deleteOne = require("./delete-one");
const xls = require("./download-via-xls");

router.post("/", asyncHandler(create));
router.get("/types", asyncHandler(businessTypes));
router.get("/xls", asyncHandler(xls));
router.get("/:id", asyncHandler(getOne));
router.get("/", asyncHandler(get));
router.patch("/:id", asyncHandler(updateOne));
router.post("/media/:id", asyncHandler(updateImage));
router.delete("/media/:id", asyncHandler(removeImage));
router.post("/icon/:id", asyncHandler(icon));
router.delete("/:id", asyncHandler(deleteOne));

module.exports = router;
