const mongoose = require('mongoose');
const renameId = require('../helpers/rename-id');
const { statuses } = require('../enums/proposal-request')

const ReplySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    details: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(statuses),
      default: statuses.PENDING,
      required: true
    },
    replies: [ReplySchema]
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: renameId
    }
  }
);

module.exports = mongoose.model('ProposalRequest', schema);
