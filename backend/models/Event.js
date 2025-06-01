const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);