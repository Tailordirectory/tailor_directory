const randomString = require('randomstring');
const { expect } = require('chai');
const Users = require('../classes/users');

describe('testing devices', () => {
  Users.get();
  Users.getOne();
  Users.getMe();
  Users.create();
  Users.update();
  Users.updateMe();
  Users.delete();
  Users.ban();
  Users.unban();
  it('get', async () => {
    const users = await Users.get();

    expect(Array.isArray(users)).equal(true);
  });

  it('getOne', async () => {});

  it('getMe', async () => {});
  it('create', async () => {});
  it('update', async () => {});
  it('updateMe', async () => {});
  it('delete', async () => {});
  it('ban', async () => {});
  it('unban', async () => {});
});
