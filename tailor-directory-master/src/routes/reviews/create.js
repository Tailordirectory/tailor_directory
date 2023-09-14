const Review = require("../../classes/models-controllers/Review");
const Business = require("../../classes/models-controllers/Business");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { id: businessId } = req.params;
  const { body } = req;
  const userId = req.user.userId;

  try {
    await Business.getById(businessId);

    const isAlreadyExist = await Review.model.findOne({
      userId,
      businessId,
    });

    if (isAlreadyExist) {
      throw getErrorObject("review_already_exists", 400);
    }

    const result = await Review.create(
      Object.assign(body, {
        userId,
        businessId,
      })
    );

    res.json(result);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
