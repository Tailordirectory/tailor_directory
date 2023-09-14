const { getErrorObject } = require('../../helpers/errors');
const { upload: s3Upload } = require('../../helpers/s3-upload');

/**
 * it's route for create sign url for file upload
 * TODO add limitations for files uploading. Now everyone have no uploading limit and can use service as free media cloud!
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
  if (!req.file) throw getErrorObject('invalid_request', 400);

  const Key = `media/${Date.now()}/${req.file.originalname
    .split(' ')
    .join('_')}`;

  try {
    const objectLocation = await s3Upload(Key, req.file);

    res.json({ url: objectLocation, type: req.file.mimetype });
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
