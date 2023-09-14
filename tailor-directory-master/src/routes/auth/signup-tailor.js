const config = require("../../config/config");
const User = require("../../classes/models-controllers/User");
const Business = require("../../classes/models-controllers/Business");
const { getErrorObject } = require("../../helpers/errors");
const Token = require("../../classes/Token");
const RefreshToken = require("../../classes/models-controllers/RefreshToken");
const { userRoles } = require("../../enums/user");
const { createdByTypes } = require("../../enums/business");

module.exports = async (req, res) => {
  const { body } = req;

  try {
    //deleting restricted props for user self setted, like role
    User.deleteDisallowedProps(body);
    body.contactPhone = body.phone;
    body.contactName = `${body.firstName} ${body.lastName}`;
    User.checkIsValidTailor(body);
    body.role = userRoles.BUSINESS;

    const user = await User.create(body);
    body.ownerId = user._id;
    Business.deleteDisallowedProps(body);
    Object.assign(body, { createdBy: createdByTypes.OWNER });
    await Business.create(body).catch((err) => {
      User.deleteById(body.ownerId);
      throw err;
    });
    //generating JWT token for auth
    const newToken = Token.createIssueToken(user, "15min");

    //generating refresh token for creating new JWT token if current JWT token expired
    const { refreshToken } = await RefreshToken.create({
      userId: user._id,
      token: newToken,
    });

    res.json({
      token: newToken,
      refreshToken,
      userId: user._id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyName: user.companyName,
      groupName: body.groupName,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      profileType: user.profileType,
    });
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
