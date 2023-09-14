const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { getErrorObject } = require("../helpers/errors");

class Token {
  constructor(secret) {
    if (!secret) {
      throw `Invalid secret input!`;
    }
    this.secret = secret;
  }

  get tokenTypes() {
    return {
      REFRESH_TOKEN: "refreshToken",
    };
  }

  get invalidRefreshTokenError() {
    return getErrorObject("INVALID_REFRESH_TOKEN", 400);
  }

  create(payload, expiresIn = "1d") {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify({ token, ignoreExpiration = false }) {
    return jwt.verify(token, this.secret, { ignoreExpiration });
  }

  decode(...args) {
    return jwt.decode(...args);
  }

  verifyRefreshToken(refreshToken) {
    const decoded = this.verify(refreshToken);

    if (!decoded || decoded.type !== this.tokenTypes.REFRESH_TOKEN) {
      return false;
    }

    return true;
  }

  createIssueToken(user, expiresIn = "1d") {
    return this.create(
      {
        userId: user._id,
        role: user.role,
        profileType: user.profileType
      },
      expiresIn
    );
  }

  createRefreshToken(userId, expiresIn = "10d") {
    return this.create(
      {
        userId,
        type: this.tokenTypes.REFRESH_TOKEN,
      },
      expiresIn
    );
  }
}

module.exports = new Token(config.JWT_SECRET);
