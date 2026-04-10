const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
