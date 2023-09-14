const Business = require("../../../classes/models-controllers/Business");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { id } = req.params;
  const { query } = req;

  try {
    if (!query.ids) {
      throw getErrorObject("invalid_request", 400);
    }

    if (typeof query.ids === "string") {
      const arr = [];
      arr.push(query.ids);
      query.ids = arr;
    }

    const object = await Business.getById(id);

    for (const _id of query.ids) {
      const index = object.media.findIndex((obj) => _id === obj._id.toString());
      if (index > -1) {
        object.media.splice(index, 1);
      }
    }

    await object.save();

    res.json({ success: true, doc: object.media });
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
