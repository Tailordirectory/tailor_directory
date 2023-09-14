const Review = require("../../classes/models-controllers/Review");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { id: businessId } = req.params;
  const userId = req.user.userId;

  try {
    const isAlreadyExist = await Review.model.findOne({
      userId,
      businessId,
    });
    const result = { exists: false };

    if (isAlreadyExist) {
      result.exists = true;
      result.doc = isAlreadyExist;
    }

    res.json(result);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
