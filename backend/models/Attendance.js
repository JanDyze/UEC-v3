const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late'],
    default: 'present'
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate attendance records
attendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);