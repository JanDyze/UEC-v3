const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

// Log attendance
router.post('/', async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get attendance for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ eventId: req.params.eventId }).populate('memberId');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance for a specific date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const attendance = await Attendance.find({ 
      date: new Date(date) 
    }).populate('memberId');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update the bulk attendance route to handle updates
router.post('/bulk', async (req, res) => {
  try {
    const { date, records } = req.body;
    
    // Delete existing records for this date first
    await Attendance.deleteMany({ date: new Date(date) });
    
    // Create new attendance records
    const attendanceRecords = records.map(record => ({
      memberId: record.memberId,
      date: new Date(date),
      status: record.status,
      notes: record.notes
    }));

    // Insert the new records
    await Attendance.insertMany(attendanceRecords);
    
    res.json({ message: 'Attendance updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new route to update a single attendance record
router.put('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        updatedAt: new Date()
      },
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;