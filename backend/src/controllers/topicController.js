const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const RevisionSchedule = require('../models/RevisionSchedule');

const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ user: req.user._id, subject: req.params.subjectId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTopic = async (req, res) => {
  try {
    const { name, priority } = req.body;
    const subject = await Subject.findById(req.params.subjectId);
    if (subject && subject.user.toString() === req.user._id.toString()) {
      const topic = new Topic({ name, subject: req.params.subjectId, user: req.user._id, priority });
      const createdTopic = await topic.save();

      // Auto-schedule initial revision for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const schedule = new RevisionSchedule({
        topic: createdTopic._id,
        user: req.user._id,
        scheduledDate: tomorrow
      });
      await schedule.save();

      res.status(201).json(createdTopic);
    } else {
      res.status(404).json({ message: 'Subject not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (topic && topic.user.toString() === req.user._id.toString()) {
      await Topic.deleteOne({ _id: req.params.id });
      res.json({ message: 'Topic removed' });
    } else {
      res.status(404).json({ message: 'Topic not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTopics, createTopic, deleteTopic };
