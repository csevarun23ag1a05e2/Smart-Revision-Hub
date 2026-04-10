const StudyMaterial = require('../models/StudyMaterial');
const Topic = require('../models/Topic');

const uploadMaterial = async (req, res) => {
  try {
    const { title, topicId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const topic = await Topic.findById(topicId);
    if (topic && topic.user.toString() === req.user._id.toString()) {
      const material = new StudyMaterial({
        title,
        topic: topicId,
        user: req.user._id,
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype
      });
      const createdMaterial = await material.save();
      res.status(201).json(createdMaterial);
    } else {
      res.status(404).json({ message: 'Topic not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ topic: req.params.topicId, user: req.user._id });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (material && material.user.toString() === req.user._id.toString()) {
      await StudyMaterial.deleteOne({ _id: req.params.id });
      res.json({ message: 'Material removed' });
    } else {
      res.status(404).json({ message: 'Material not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMaterial, getMaterials, deleteMaterial };
