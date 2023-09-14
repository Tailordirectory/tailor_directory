const mongoose = require('mongoose');
const { types } = require('../enums/notifications');
const renameId = require('../helpers/rename-id');

const schema = new mongoose.Schema({
  notificationType: {
    type: String,
    enum: Object.values(types),
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  viewedAt: {
    type: Date,
  },
  isSended: {
    type: Boolean,
  },
},
{
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: renameId,
  },
});

module.exports = mongoose.model('Notification', schema);
