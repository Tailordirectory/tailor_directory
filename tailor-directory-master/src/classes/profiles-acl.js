const profiles = require("../config/profiles.json");
const { getErrorObject } = require('../helpers/errors')

class Profiles {
  static get config() {
    return profiles;
  }

  static get groups() {
    return Object.keys(profiles.accounts);
  }

  static getPermissionsByGroup(group) {
    if (!this.groups.includes(group)) {
      throw getErrorObject("invalid_profile_type");
    }
    return this.config.accounts[group];
  }

  static getProfileTypeScore(type) {
    const scores = {
      'basic': 2,
      'premium': 1,
      'premium_plus': 0,
    };

    return scores[type];
  }
}

module.exports = Profiles;
