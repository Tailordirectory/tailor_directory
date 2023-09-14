const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const { types } = require("../enums/one-time-pass");

const schema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(types),
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("OneTimePassword", schema);
