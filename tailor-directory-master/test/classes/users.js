const Request = require('./request');

class Users {
  static get() {
    return Request.api('GET', `/users`, true);
  }
  static getOne(userId) {
    return Request.api('GET', `/users/${userId}`, true);
  }
  static getMe() {
    return Request.api('GET', `/users/me`, true);
  }
  static create(body) {
    return Request.api('POST', '/users', true, body);
  }
  static delete(userId) {
    return Request.api('DELETE', `/users/${userId}`, true);
  }

  static update(userId, body) {
    return Request.api('PATCH', `/users/${userId}`, true, body);
  }

  static updateMe(body) {
    return Request.api('PATCH', '/users/me', true, body);
  }

  static ban(userId) {
    return Request.api('POST', `/users/ban/${userId}`, true);
  }
  static unban(userId) {
    return Request.api('POST', `/users/unban/${userId}`, true);
  }
}

module.exports = Users;
