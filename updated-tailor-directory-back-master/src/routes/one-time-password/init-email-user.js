const OneTimePassword = require("../../classes/models-controllers/OneTimePassword");
const { getErrorObject } = require("../../helpers/errors");
const { types } = require("../../enums/one-time-pass");
const Token = require("../../classes/Token");
const config = require("../../config/config");
const Email = require("../../classes/Email");

module.exports = async (req, res) => {
  try {
    const oneTimePass = await OneTimePassword.init({
      userId: req.user.userId,
      type: types.EMAIL_USER,
    });

    const token = Token.create(oneTimePass._doc);

    if (config.EMAIL_ENABLE) {
      const url = `${config.VERIFY_USER_EMAIL_ACTION_URL}/${token}`;
      Email.sendEmail({
        to: req.userData.email,
        subject: "Verificate your email",
        body: `Hello, here is link for verificate your user email:
        ${url} 
        This link will be expired in 24 hours
        If it wasn't you requested password reset - just ignore this email.`,
      });
    }

    res.json(oneTimePass);
  } catch (error) {
    throw getErrorObject("GENERAL_ERROR", 400, error);
  }
};
