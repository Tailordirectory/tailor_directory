const randomString = require('randomstring');
const { expect } = require('chai');
const request = require('../classes/request');

const testUser = {
  email: `${randomString.generate(7)}@example.com`,
  password: 'password',
  userType: 'individual',
  image: 'http://some-url.com/avatar.jpg',
  firstName: 'John',
  lastName: 'Wick',
  userName: randomString.generate(10),
  location: {
    state: 'FL',
    city: 'Miami',
    county: 'Miami-Dade',
    zipCode: '33101'
  }
};

describe('testing auth', () => {
  it('signup', async () => {
    const res = await request.signUp(testUser);

    expect(res).to.have.own.property('token');
    expect(res).to.have.own.property('refreshToken');
  });

  it('signin', async () => {
    const body = {
      email: testUser.email,
      password: testUser.password,
      captchaToken: ''
    };

    const res = await request.signIn(body);

    expect(res).to.have.own.property('token');
    expect(res).to.have.own.property('refreshToken');
  });

  it('verify-email', async () => {
    const body = {
      email: testUser.email,
      password: testUser.password
    };

    const res = await request.signIn(body);

    const html = await request.verifyEmail(res.token);
    expect(
      html.message.includes('Your email address has already been verified') ||
        html.message.includes(
          'Your email address has been verified successfully'
        )
    ).equal(true);
  });

  it('refresh-token', async () => {
    const body = {
      email: testUser.email,
      password: testUser.password
    };

    const res = await request.signIn(body);
    const refreshToken = await request.refreshToken(res.refreshToken);

    expect(refreshToken).to.have.own.property('token');
    expect(refreshToken).to.have.own.property('refreshToken');
  });
});
