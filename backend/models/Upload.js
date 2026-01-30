const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  bucket: {
    type: String,
    required: true
  },
  directory: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Upload', uploadSchema);
