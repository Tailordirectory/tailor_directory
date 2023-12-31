const User = require("../../classes/models-controllers/User");
const verifyToken = require("../../helpers/verify-token");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { body } = req;
  const { userToken } = req.params;
  if (!body.password) {
    throw getErrorObject("invalid_password", 400);
  }
  try {
    const decodedToken = verifyToken(userToken);

    const user = await User.getById(decodedToken.userId);

    user.password = body.password;
    await user.save();

    res.send({ message: "New password has been set successfully." });
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
