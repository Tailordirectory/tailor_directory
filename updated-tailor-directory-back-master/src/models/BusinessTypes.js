const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    icon: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("BusinessTypes", schema);
