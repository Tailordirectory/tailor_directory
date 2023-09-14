const express = require("express");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { socialAuth } = require("./helpers");

const router = express.Router();

const signup = require("./signup");
const signin = require("./signin");
const refreshToken = require("./refresh-token");
const appleAuth = require("./apple-auth");
const forgotPassword = require("./forgot-password");
const getForgotPasswordPage = require("./get-forgot-pass-page");
const resetPasswordByToken = require("./forgot-password-by-token");
const signupTailor = require("./signup-tailor");

router.post("/signup", asyncHandler(signup));
router.post("/signup/tailor", asyncHandler(signupTailor));
router.post("/signin", asyncHandler(signin));
router.post("/signin/refresh", asyncHandler(refreshToken));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.get("/forgot-password/:userToken", asyncHandler(getForgotPasswordPage));
router.post("/forgot-password/:userToken", asyncHandler(resetPasswordByToken));

router.post(
  "/facebook",
  passport.authenticate("facebook-token", { session: false }),
  asyncHandler(socialAuth)
);

router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  asyncHandler(socialAuth)
);

router.post("/apple", asyncHandler(appleAuth));

module.exports = router;
