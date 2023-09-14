const request = require('request-promise-native').defaults({
  json: true,
  resolveWithFullResponse: true
});
require('../../src/bin/create-admin');
const testUser = {
  email: 'admin@admin.com',
  password: 'password',
  firstName: 'John',
  userName: 'admin',
  lastName: 'Wick'
};

class TestRequest {
  constructor(baseUrl) {
    this.defaults = {
      baseUrl
    };
  }

  async signUp(body) {
    const res = await this.api('POST', '/auth/signup', false, body);

    if (!res.token) {
      throw new Error('Signup failed');
    }

    this.defaults.auth = {
      bearer: res.token
    };
    return res;
  }

  async signIn(body) {
    const res = await this.api('POST', '/auth/signin', false, body);

    if (!res.token) {
      throw new Error('Signup failed');
    }
    /* console.log(res.token); */
    this.defaults.auth = {
      bearer: res.token
    };
    return res;
  }

  refreshToken(refreshToken) {
    return this.api('POST', `/auth/signin/refresh/${refreshToken}`, false, {});
  }

  async auth() {
    this.authorized = true;
    try {
      await this.signUp(testUser);
    } catch (error) {
      const body = {
        email: testUser.email,
        password: testUser.password,
        captchaToken: ''
      };

      await this.signIn(body).catch(() => {
        this.authorized = false;
      });
    }
    if (this.authorized) {
      const token = this.defaults.auth.bearer;
      await this.verifyEmail(token);
    }
  }

  verifyEmail(token) {
    return this.api('GET', `/auth/verify-email/${token}`);
  }

  async api(method, uri, auth = false, body = {}) {
    if (auth && !this.authorized) {
      await this.auth();
    }
    const options = Object.assign(
      {
        uri,
        method,
        [method === 'GET' ? 'qs' : 'body']: body
      },
      this.defaults
    );

    const { body: res, statusCode } = await request(options);

    /* console.log(res); */

    if (!res || res.error || statusCode !== 200) {
      throw new Error(`Error ${res.message}, statusCode:${statusCode}`);
    }

    return res;
  }
}

module.exports = new TestRequest('http://localhost:3000');
