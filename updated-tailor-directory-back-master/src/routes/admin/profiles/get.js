const Permissions = require("../../../classes/profiles-acl");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  try {
    const permissions = Permissions.config;

    res.json(permissions.accounts);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
