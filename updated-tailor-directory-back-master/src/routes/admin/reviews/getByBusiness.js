const Reviews = require("../../../classes/models-controllers/Review");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { query } = req;
  const queryFilter = { businessId: id };
  const limit = Number(query.limit) || 10;
  const offset = (Number(query.page) - 1) * limit || 0;

  try {
    const reviews = await Reviews.paginate(
      queryFilter,
      offset,
      limit,
      query.sort
    );

    res.json(reviews);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
