const Business = require("../../classes/models-controllers/Business");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const business = await Business.getById(id);
    await business
      .populate("tags")
      .populate("businessTypeId")
      .populate("ownerId", { _id: 1, profileType: 1 })
      .execPopulate();
    res.json(business);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
