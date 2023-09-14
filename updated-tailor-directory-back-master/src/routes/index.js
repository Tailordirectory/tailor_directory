const express = require("express");
const logger = require("../helpers/logger");
const router = express.Router();

//routes
const authRoutes = require("./auth");
const usersRoutes = require("./users");
const devicesRoutes = require("./devices");
const reviewsRoutes = require("./reviews");
const businessRoutes = require("./business");
const tagsRoutes = require("./tags");
const proposalRequestRoutes = require("./proposal-request");
const i18n = require("./i18n");
const xls = require("./xls");
const oneTimePass = require("./one-time-password");
const mediaRoutes = require("./media");
const claimRequest = require("./claim-request");
const profiles = require("./profiles");
const admin = require("./admin");

//routes init
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/devices", devicesRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/business", businessRoutes);
router.use("/tags", tagsRoutes);
router.use("/proposal-request", proposalRequestRoutes);
router.use("/i18n", i18n);
router.use("/media", mediaRoutes);
router.use("/xls", xls);
router.use("/one-time-pass", oneTimePass);
router.use("/claim-request", claimRequest);
router.use("/profiles", profiles);
router.use("/admin", admin)

//init route for debug info from client
router.post("/debug", (req, res, next) => {
  logger.error("___________DEBUG INFO FROM THE CLIENT___________", req.body);
  res.status(200).json({ success: true });
});

module.exports = router;
