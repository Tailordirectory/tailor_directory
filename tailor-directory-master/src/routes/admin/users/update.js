const User = require("../../../classes/models-controllers/User");
const passwordHelper = require("../../../helpers/password");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    //find current user doc
    const oldUser = await User.getById(id);

    //matching current password with body.oldPassword and sets new password for user if they matches
    if (body.oldPassword && body.newPassword) {
      const match = await passwordHelper.match({
        password: body.oldPassword,
        hashString: oldUser.password,
      });
      if (!match) throw getErrorObject("old_password_not_valid", 400);

      body.password = body.newPassword;

      delete body.newPassword;
      delete body.oldPassword;
    }

    //update user function
    const user = await User.update(id, body);

    //return updated user in response
    res.json(user);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
