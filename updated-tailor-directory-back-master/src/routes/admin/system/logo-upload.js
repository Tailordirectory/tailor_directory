const path = require('path');
const { getErrorObject } = require('../../../helpers/errors');
const { upload: s3Upload } = require('../../../helpers/s3-upload');

/**
 * App global logo uploading
 * @param req
 * @param res
 * @return {Promise<void>}
 */
module.exports = async (req, res) => {
  const { file } = req;

  if (!file) throw getErrorObject('invalid_request', 400);

  if (!req.file.originalname.match(/\.(png|svg)$/)) { // jpg|jpeg|png|gif|svg
    throw new Error('Only image files (png, svg) are allowed!');
  }

  try {
    const Key = `system/logos/base-logo.${path.extname(file.originalname)}`;
    const location = await s3Upload(Key, file);

    res.send({ success: true, doc: location });
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
