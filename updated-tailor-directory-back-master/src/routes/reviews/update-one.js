const Review = require("../../classes/models-controllers/Review");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const object = await Review.getById(id);
    await Review.checkIsOwner(req.userData, object);

    Review.deleteDisallowedProps(req.body);
    const review = await Review.update(id, req.body);

    res.json(review);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
