const mongoose = require("mongoose");
const { statuses } = require("../enums/claim-request");
const mongoosePaginate = require("mongoose-paginate");

const AdminHistoryReplies = new mongoose.Schema(
  {
    message: { type: String, required: true },
  },
  { _id: false, versionKey: false, timestamps: true }
);

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    historyReplies: {
      type: [AdminHistoryReplies],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(statuses),
      default: statuses.PENDING,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("ClaimRequest", schema);
