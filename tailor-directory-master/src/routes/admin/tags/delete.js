const Tags = require("../../../classes/models-controllers/Tags");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await Tags.deleteById(id);

    res.json(tag);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
