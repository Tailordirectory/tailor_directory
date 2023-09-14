const Permissions = require("../../classes/profiles-acl");
const { getErrorObject } = require("../../helpers/errors");
const User = require("../../classes/models-controllers/User");

module.exports = async (req, res) => {
  const { profileType } = req.body;

  try {
    Permissions.getPermissionsByGroup(profileType);

    const user = await User.update(req.user.userId, { profileType })

    res.json(user);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
