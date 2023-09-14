const randomString = require('randomstring');
const { expect } = require('chai');
const Devices = require('../classes/devices');

describe('testing devices', () => {
  it('create', async () => {
    const body = {
      deviceId: randomString.generate(10),
      deviceType: 0
    };
    const res = await Devices.bind(body);

    expect(res).to.have.own.property('deviceId');
    expect(res).to.have.own.property('deviceType');
    expect(res).to.have.own.property('userId');
    expect(res).to.have.own.property('createdAt');
    expect(res).to.have.own.property('updatedAt');
    expect(res).to.have.own.property('id');
  });

  it('unbind', async () => {
    const body = {
      deviceId: randomString.generate(10),
      deviceType: 0
    };

    const res = await Devices.bind(body);

    const unbindRes = await Devices.unbind(res.id);

    expect(unbindRes).to.deep.equal({ success: true });
  });

  it('getDeviceTypes', async () => {
    const res = await Devices.getDeviceTypes();
    expect(res && typeof res === 'object').equal(true);
  });
});
