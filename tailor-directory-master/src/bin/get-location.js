const request = require("request-promise-native");
const config = require("../config/config");

class GeoCode {
  constructor(key) {
    this.key = key;
    this.uri = "https://maps.googleapis.com/maps/api/geocode/json";
  }

  async api(options) {
    const qs = Object.assign({ key: this.key }, options);

    const res = await request.get(this.uri, { qs, json: true });

    if (res && res.error_message) {
      throw res.error_message;
    }

    return res;
  }

  async getCoordinatesByAddress(address) {
    const coordinates = await this.api({ address, language: "de" });
    if (!coordinates || !coordinates.results || !coordinates.results.length) {
      return {};
    }

    const { lat, lng } = coordinates.results[0].geometry.location;

    return { latitude: lat, longitude: lng };
  }
}

module.exports = new GeoCode(config.GOOGLE_MAPS_KEY);
