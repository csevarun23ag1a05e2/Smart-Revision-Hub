const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
