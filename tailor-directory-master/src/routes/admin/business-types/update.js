const BusinessTypes = require("../../../classes/models-controllers/BusinessTypes");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const businessTypes = await BusinessTypes.update(id, body);

    res.json(businessTypes);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
