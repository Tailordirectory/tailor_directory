const express = require("express");
const asyncHandler = require("express-async-handler");
const { upload } = require("../../helpers/upload");

const router = express.Router();
const search = require("./search");
const getOne = require("./get-one");
const update = require("./update");
const deleteOne = require("./delete-one");
const create = require("./create");
const getBusinessTypes = require("./get-business-types");
const getMyBusiness = require("./get-me");
const getAnother = require("./get-another-business");
const updateIcon = require("./icon");
const updateMedia = require("./upload-media");
const removeMedia = require("./remove-media");

router.get("/types", asyncHandler(getBusinessTypes));
router.get("/", asyncHandler(search));
router.post("/icon/:id", upload.single("file"), asyncHandler(updateIcon));
router.post("/media/:id", upload.array("files"), asyncHandler(updateMedia));
router.delete("/media/:id", asyncHandler(removeMedia));
router.post("/", asyncHandler(create));
router.get("/me", asyncHandler(getMyBusiness));
router.get("/another/:id", asyncHandler(getAnother));
router.get("/:id", asyncHandler(getOne));
router.patch("/:id", asyncHandler(update));
router.delete("/:id", asyncHandler(deleteOne));

module.exports = router;
