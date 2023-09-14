const BusinessTypes = require("../../../classes/models-controllers/BusinessTypes");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const businessTypes = await BusinessTypes.deleteById(id);

    res.json(businessTypes);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
