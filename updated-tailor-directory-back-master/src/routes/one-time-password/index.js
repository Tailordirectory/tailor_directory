const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();

const initEmail = require("./init-email");
const initPhone = require("./init-phone");
const confirmEmail = require("./confirm-email");
const confirmPhone = require("./confirm-phone");
const initUserEmail = require("./init-email-user");
const confirmUserEmail = require("./confirm-email-user");

router.post("/init-phone/:id", asyncHandler(initPhone));
router.post("/init-email/:id", asyncHandler(initEmail));
router.get("/confirm-email/:id", asyncHandler(confirmEmail));
router.post("/confirm-phone/:id", asyncHandler(confirmPhone));
router.post("/me/init-email", asyncHandler(initUserEmail));
router.get("/me/confirm-email/:id", asyncHandler(confirmUserEmail));

module.exports = router;
