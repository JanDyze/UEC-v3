const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Attendance = require('../models/Attendance');

// Add a member
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete member and their attendance records
router.delete('/:id', async (req, res) => {
  try {
    // Delete all attendance records for this member
    await Attendance.deleteMany({ memberId: req.params.id });
    
    // Delete the member
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json({ message: 'Member and attendance records deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;