const ClaimRequest = require("../../classes/models-controllers/ClaimRequest");
const Business = require("../../classes/models-controllers/Business");
const Email = require("../../classes/Email");
const config = require("../../config/config");

const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { body } = req;

  try {
    const business = await Business.getById(req.body.businessId);

    if (business.ownerId) {
      throw getErrorObject("owner_already_exists", 400);
    }

    const isExists = await ClaimRequest.model.findOne({
      businessId: req.body.businessId,
      userId: req.user.userId,
    });

    if (isExists) {
      throw getErrorObject("claim_request_already_exists", 400);
    }

    ClaimRequest.deleteDisallowedProps(body);
    body.userId = req.user.userId;
    body.messages = [{
      message: body.messages,
      senderId: req.user.userId
    }]
    const claimRequest = await ClaimRequest.create(body);

    if (config.EMAIL_ENABLE) {
      await Email.sendEmail({
        to: "mail@tailor-directory.com",
        subject: "Claim Ownership Request for " + req.body.businessId,
        body:
          `This is a claim ownership request for business - https://dev.tailor-directory.com/business/${req.body.businessId} \n` +
          `User: \n` +
          `Email: ${req.userData.email} \n` +
          `FullName: ${req.userData.firstName} ${req.userData.lastName} \n` +
          `UserId: ${req.user.userId} \n` +
          `Additional message: ${req.body.message}`,
      });
    }
    res.json(claimRequest);
  } catch (error) {
    console.log(error.stack);
    throw getErrorObject("general_error", 500, error);
  }
};
