const Tags = require("../../../classes/models-controllers/Tags");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { body } = req;

  try {
    const tag = await Tags.create(body);

    res.json(tag);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
