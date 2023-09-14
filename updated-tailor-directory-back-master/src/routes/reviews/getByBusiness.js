const Review = require("../../classes/models-controllers/Review");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const limit = Number(req.query.limit || 100);
  const offset = Number(req.query.offset || 0);

  try {
    const review = await Review.model
      .find({ businessId: id })
      .limit(limit)
      .skip(offset)
      .populate("userId", { userName: 1, firstName: 1, lastName: 1 });
    const total = await Review.model.count({ businessId: id });

    res.json({ docs: review, total });
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
