const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const subject = new Subject({ name, description, user: req.user._id });
    const createdSubject = await subject.save();
    res.status(201).json(createdSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject && subject.user.toString() === req.user._id.toString()) {
      await Subject.deleteOne({ _id: req.params.id });
      await Topic.deleteMany({ subject: req.params.id });
      res.json({ message: 'Subject removed' });
    } else {
      res.status(404).json({ message: 'Subject not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubjects, createSubject, deleteSubject };
