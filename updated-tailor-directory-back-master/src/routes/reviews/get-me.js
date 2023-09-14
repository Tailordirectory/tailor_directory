const Review = require("../../classes/models-controllers/Review");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const userId = req.user.userId;
  const limit = Number(req.query.limit || 10);
  const offset = Number(req.query.offset || 0);

  try {
    const review = await Review.paginate({ userId }, offset, limit);

    res.json(review);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
