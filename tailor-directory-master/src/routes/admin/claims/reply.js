const ClaimRequest = require("../../../classes/models-controllers/ClaimRequest");

const { getErrorObject } = require("../../../helpers/errors");
const { userSelect, businessSelect } = require("../../../enums/claim-request");

module.exports = async (req, res) => {
  const claimId = req.params.id;
  const { body } = req;

  try {
    const claim = await ClaimRequest.getById(claimId);
    const { message } = body;

    if (!message) {
      throw getErrorObject("invalid_claim_reply_message");
    }

    if (!claim.historyReplies) claim.historyReplies = [];

    claim.historyReplies.push({
      message,
    });

    await claim.save();

    await claim
      .populate("businessId", businessSelect)
      .populate("userId", userSelect)
      .execPopulate();

    res.json(claim);
  } catch (error) {
    console.log(error.stack);
    throw getErrorObject("general_error", 500, error);
  }
};
