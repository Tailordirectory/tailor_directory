const Tags = require("../../classes/models-controllers/Tags");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    //find current Tags doc
    Tags.deleteDisallowedProps(body);
    const tag = await Tags.update(id, body);

    res.json(tag);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
