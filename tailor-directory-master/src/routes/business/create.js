const Business = require("../../classes/models-controllers/Business");
const BusinessTypes = require("../../classes/models-controllers/BusinessTypes");
const { getErrorObject } = require("../../helpers/errors");
const { createdByTypes } = require("../../enums/business");

module.exports = async (req, res) => {
  const { body } = req;

  try {
    Business.deleteDisallowedProps(body);
    body.ownerId = req.user.userId;

    Object.assign(body, { createdBy: createdByTypes.OWNER });
    const user = await Business.create(body);

    res.json(user);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
