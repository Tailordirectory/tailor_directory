const express = require("express");
const asyncHandler = require("express-async-handler");
const { upload } = require("../../../helpers/upload");

const router = express.Router();
const get = require("./get");
const create = require("./create");
const update = require("./update");
const deleteOne = require("./delete");
const icon = require("./icon");

router.get("/", asyncHandler(get));
router.post("/", asyncHandler(create));
router.patch("/:id", asyncHandler(update));
router.delete("/:id", asyncHandler(deleteOne));
router.post("/icon/:id", upload.single("file"), asyncHandler(icon));

module.exports = router;
