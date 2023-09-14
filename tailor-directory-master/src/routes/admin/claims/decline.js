const Claim = require("../../../classes/models-controllers/ClaimRequest");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const claim = await Claim.decline(id);

    res.json(claim);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
