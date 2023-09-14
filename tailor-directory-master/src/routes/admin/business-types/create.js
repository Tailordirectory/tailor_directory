const BusinessTypes = require("../../../classes/models-controllers/BusinessTypes");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { body } = req;

  try {
    const businessTypes = await BusinessTypes.create(body);

    res.json(businessTypes);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
