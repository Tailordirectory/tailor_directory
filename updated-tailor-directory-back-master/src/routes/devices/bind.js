const Device = require('../../classes/models-controllers/Device');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const user = req.userData;
  if (!user) throw getErrorObject('user_not_found', 404);
  if (!req.body.deviceId) throw getErrorObject('device_id_required', 400);

  try {
    await Device.model.deleteMany({
      deviceId: req.body.deviceId
    });

    const device = await Device.create(
      Object.assign(req.body, {
        userId: user._id
      })
    );

    return res.json(device);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
