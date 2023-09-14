const Tags = require("../../classes/models-controllers/Tags");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { body } = req;

  try {
    Tags.deleteDisallowedProps(body);
    const user = await Tags.create(body);

    res.json(user);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
