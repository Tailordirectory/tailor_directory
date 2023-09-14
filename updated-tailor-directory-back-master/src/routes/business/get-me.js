const Business = require("../../classes/models-controllers/Business");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const ownerId = req.user.userId;
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 100;

  try {
    const business = await Business.model
      .find({ ownerId })
      .limit(limit)
      .skip(offset)
      .populate("tags")
      .populate("businessTypeId")
      .populate("ownerId", {
        _id: 1,
        userName: 1,
        business: 1,
        profileType: 1,
      });

    res.json(business);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
