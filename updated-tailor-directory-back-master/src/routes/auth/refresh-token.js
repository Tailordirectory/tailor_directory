const { getErrorObject } = require("../../helpers/errors");
const Token = require("../../classes/Token");
const RefreshToken = require("../../classes/models-controllers/RefreshToken");

module.exports = async (req, res) => {
  const { refreshToken } = req.body;

  const oldRefreshToken = await RefreshToken.getOne({ refreshToken });
  await oldRefreshToken.populate("userId").execPopulate();
  const user = oldRefreshToken.userId;
  try {
    const token = Token.createIssueToken(oldRefreshToken.userId, "15min");
    const { refreshToken: newRefreshToken } = await RefreshToken.create({
      userId: oldRefreshToken.userId._id,
      token,
    });

    await oldRefreshToken.remove();

    return res.json({
      token,
      refreshToken: newRefreshToken,
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
    console.log(error);
    throw getErrorObject("general_error", 400, error);
  }
};
