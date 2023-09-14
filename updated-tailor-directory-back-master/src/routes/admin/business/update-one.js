const Business = require("../../../classes/models-controllers/Business");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const business = await Business.updateForAdmin(id, body);

    res.json(business);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
