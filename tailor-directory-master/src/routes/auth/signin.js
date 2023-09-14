const User = require("../../classes/models-controllers/User");
const passwordHelper = require("../../helpers/password");
const { getErrorObject } = require("../../helpers/errors");
const Token = require("../../classes/Token");
const issueRefreshToken = require("../../classes/models-controllers/RefreshToken");
const { userRoles } = require("../../enums/user");

module.exports = async (req, res) => {
  const { body } = req;

  try {
    const user = await User.getOne({
      email: body.email,
      role: { $ne: userRoles.ADMIN },
    });

    if (user.bannedAt) throw getErrorObject("user_banned", 403);

    const match = await passwordHelper.match({
      password: body.password,
      hashString: user.password,
    });
    if (!match) throw getErrorObject("credentials_not_valid", 401);

    const token = Token.createIssueToken(user, "15min");

    const { refreshToken } = await issueRefreshToken.create({
      userId: user._id,
      token,
    });

    res.json({
      token,
      refreshToken,
      userId: user._id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyName: user.companyName,
      groupName: user.groupName,
      profileType: user.profileType,
    });
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
