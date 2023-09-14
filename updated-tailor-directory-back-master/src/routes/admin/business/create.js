const Business = require("../../../classes/models-controllers/Business");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { body } = req;

  try {
    const user = await Business.create(body);

    res.json(user);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
