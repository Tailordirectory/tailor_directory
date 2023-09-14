const { getErrorObject } = require('../../../helpers/errors');
const Business = require('../../../classes/models-controllers/Business');
const { upload: s3Upload } = require('../../../helpers/s3-upload');

/**
 * it's route for create sign url for file upload
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
  if (!req.file) throw getErrorObject('invalid_request', 400);
  const { id } = req.params;

  const Key = `media/${Date.now()}/${req.file.originalname
    .split(' ')
    .join('_')}`;

  try {
    const icon = await s3Upload(Key, req.file);

    await Business.update(id, { icon });

    res.send({ success: true, doc: icon });
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
