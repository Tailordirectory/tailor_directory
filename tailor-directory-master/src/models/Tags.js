const mongoose = require('mongoose');
const renameId = require('../helpers/rename-id');
const mongoosePaginate = require('mongoose-paginate');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Tags', schema);
