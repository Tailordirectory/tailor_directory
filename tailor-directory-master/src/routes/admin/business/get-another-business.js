const Business = require("../../../classes/models-controllers/Business");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { query } = req;
  const offset = Number(query.offset) || 0;
  const limit = Number(query.limit) || 100;

  try {
    const business = await Business.getById(id);
    if (!business.ownerId) {
      return res.json([]);
    }
    const anotherBusiness = await Business.model
      .find({
        _id: { $ne: id },
        ownerId: business.ownerId,
      })
      .limit(limit)
      .skip(offset)
      .populate("tags");

    res.json(anotherBusiness);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
