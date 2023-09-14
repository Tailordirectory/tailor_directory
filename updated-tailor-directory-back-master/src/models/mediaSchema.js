const mongoose = require('mongoose')
const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
},
  {
    _id: true,
  });

module.exports = mediaSchema
