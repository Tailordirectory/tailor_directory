const OneTimePassword = require("../../classes/models-controllers/OneTimePassword");
const { getErrorObject } = require("../../helpers/errors");
const Token = require("../../classes/Token");

module.exports = async (req, res) => {
  const { id } = req.params;

  const { token, userId } = Token.decode(id);

  try {
    await OneTimePassword.verifyUserEmail(token, userId);

    res.json({ success: true });
  } catch (error) {
    throw getErrorObject("GENERAL_ERROR", 400, error);
  }
};
