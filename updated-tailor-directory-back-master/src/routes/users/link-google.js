const User = require("../../classes/models-controllers/User");
const { getErrorObject } = require("../../helpers/errors");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    if (!req.body.access_token) {
      throw getErrorObject("access_token_required");
    }

    const { sub: googleId, exp } = jwt.decode(req.body.access_token);

    if (Date.now() > exp * 1000) {
      throw getErrorObject("TOKEN_EXPIRED");
    }

    await User.update(req.user.userId, {
      googleId,
    });

    res.send({ sucess: true });
  } catch (err) {
    throw getErrorObject("general_error", 500, error);
  }
};
