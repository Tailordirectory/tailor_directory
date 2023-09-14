const Review = require("../../../classes/models-controllers/Review");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.update(id, req.body);

    res.json(review);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
