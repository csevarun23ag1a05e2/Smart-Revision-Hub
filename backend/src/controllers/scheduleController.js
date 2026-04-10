const RevisionSchedule = require('../models/RevisionSchedule');
const Topic = require('../models/Topic');

const getSchedules = async (req, res) => {
  try {
    const schedules = await RevisionSchedule.find({ user: req.user._id }).populate('topic');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markComplete = async (req, res) => {
  try {
    const schedule = await RevisionSchedule.findById(req.params.id);
    if (schedule && schedule.user.toString() === req.user._id.toString()) {
      schedule.completed = true;
      await schedule.save();

      // Schedule next revision based on simple spaced repetition (e.g., +3 days)
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 3);

      const newSchedule = new RevisionSchedule({
        topic: schedule.topic,
        user: req.user._id,
        scheduledDate: nextDate
      });
      await newSchedule.save();

      res.json({ message: 'Marked as complete and next revision scheduled', schedule });
    } else {
      res.status(404).json({ message: 'Schedule not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSchedules, markComplete };
