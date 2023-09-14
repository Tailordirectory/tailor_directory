const Business = require("../../classes/models-controllers/Business");
const { userRoles } = require("../../enums/user");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const object = await Business.getById(id);
    await Business.checkIsOwner(req.userData, object);

    Business.deleteDisallowedProps(body);
    if (body.email && body.email !== object.email) {
      body.emailVerifiedAt = null;
    }

    const business = await Business.update(id, body);

    res.json(business);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
