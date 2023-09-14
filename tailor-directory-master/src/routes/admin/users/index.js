const express = require("express");
const asyncHandler = require("express-async-handler");

const router = express.Router();
const createUser = require("./create");
const getUsers = require("./get");
const getById = require("./get-one");
const updateUser = require("./update");
const deleteUser = require("./delete");
const xls = require("./xls");

router.post("/", asyncHandler(createUser));
router.get("/owners-xls", asyncHandler(xls));
router.get("/", asyncHandler(getUsers));
router.get("/:id", asyncHandler(getById));
router.patch("/:id", asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

module.exports = router;
