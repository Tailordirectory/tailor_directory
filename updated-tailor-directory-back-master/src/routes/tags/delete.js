const Tags = require("../../classes/models-controllers/Tags");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const business = await Tags.deleteById(id);

    res.json(business);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
