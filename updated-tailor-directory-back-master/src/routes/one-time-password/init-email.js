const OneTimePassword = require("../../classes/models-controllers/OneTimePassword");
const { getErrorObject } = require("../../helpers/errors");
const { types } = require("../../enums/one-time-pass");
const Token = require("../../classes/Token");
const config = require("../../config/config");
const Email = require("../../classes/Email");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const oneTimePass = await OneTimePassword.init({
      businessId: id,
      type: types.EMAIL,
    });

    await oneTimePass.populate("businessId").execPopulate();

    if (!oneTimePass.businessId) {
      throw getErrorObject("business_not_found", 400);
    }

    if (
      oneTimePass.businessId.ownerId.toString() !== req.user.userId.toString()
    ) {
      throw getErrorObject("haven'doesnt_have_permissions", 403);
    }

    const email = oneTimePass.businessId.email;
    oneTimePass._doc.businessId = oneTimePass.businessId._id;
    const token = Token.create(oneTimePass._doc);

    if (config.EMAIL_ENABLE) {
      const url = `${config.VERIFY_EMAIL_ACTION_URL}/${token}`;
      Email.sendEmail({
        to: email,
        subject: "Verificate your email",
        body: `Hello, here is link for verificate your business email:
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
