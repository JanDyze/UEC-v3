const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['donation', 'expense'], required: true },
  category: String,
  description: String,
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
});

module.exports = mongoose.model('Transaction', transactionSchema);