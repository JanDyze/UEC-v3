const mongoose = require('mongoose');

const minuteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String, // Text or markdown
  fileUrl: String, // Optional: URL to PDF stored in S3/Cloudinary
  meetingDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Minute', minuteSchema);