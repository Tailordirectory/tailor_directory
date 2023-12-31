const { getErrorObject } = require("../helpers/errors");

const checkIfUserIsBanned = async (req, res, next) => {
  if (req.userData && req.userData.bannedAt)
    throw getErrorObject("user_banned", 403);
  return next();
};

module.exports = {
  checkIfUserIsBanned
};
