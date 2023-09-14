const BusinessTypes = require("../../../models/BusinessTypes");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  try {
    const businessTypes = await BusinessTypes.find();

    res.json(businessTypes);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
