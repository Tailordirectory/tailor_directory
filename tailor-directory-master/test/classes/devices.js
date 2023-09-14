const Request = require('./request');

class Devices {
  static bind(body) {
    return Request.api('POST', '/devices/me', true, body);
  }

  static unbind(deviceId) {
    return Request.api('DELETE', `/devices/me/${deviceId}`, true);
  }

  static getDeviceTypes() {
    return Request.api('GET', '/devices/types', true);
  }
}

module.exports = Devices;
