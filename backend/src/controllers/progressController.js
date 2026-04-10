const QuizResult = require('../models/QuizResult');
const RevisionSchedule = require('../models/RevisionSchedule');
const Topic = require('../models/Topic');

const getProgress = async (req, res) => {
  try {
    const totalTopics = await Topic.countDocuments({ user: req.user._id });

    // Get unique topics that have completed revision schedules
    const completedSchedules = await RevisionSchedule.find({ user: req.user._id, completed: true }).distinct('topic');
    const completedTopicsCount = completedSchedules.length;

    const quizResults = await QuizResult.find({ user: req.user._id }).populate('topic', 'name');

    let totalScore = 0;
    let totalPossible = 0;
    quizResults.forEach(r => {
      totalScore += r.score;
      totalPossible += r.totalQuestions;
    });

    const averageQuizScore = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

    res.json({
      totalTopics,
      completedTopics: completedTopicsCount,
      completionPercentage: totalTopics > 0 ? (completedTopicsCount / totalTopics) * 100 : 0,
      averageQuizScore,
      recentQuizResults: quizResults.slice(-5) // Last 5
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProgress };
