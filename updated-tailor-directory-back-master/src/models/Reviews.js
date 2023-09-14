const mongoose = require("mongoose");
const renameId = require("../helpers/rename-id");
const mongoosePaginate = require("mongoose-paginate");

const schema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Reviews", schema);
