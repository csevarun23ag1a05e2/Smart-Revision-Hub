const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Topic = require('../models/Topic');

const getQuizzesForTopic = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ topic: req.params.topicId });
    // Don't send correctAnswerIndex to client
    const sanitizedQuizzes = quizzes.map(q => ({
      _id: q._id,
      topic: q.topic,
      question: q.question,
      options: q.options
    }));
    res.json(sanitizedQuizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { topicId, answers } = req.body; // answers: { quizId: selectedIndex }
    const quizzes = await Quiz.find({ topic: topicId });

    let score = 0;
    quizzes.forEach(quiz => {
      if (answers[quiz._id] === quiz.correctAnswerIndex) {
        score++;
      }
    });

    const result = new QuizResult({
      topic: topicId,
      user: req.user._id,
      score,
      totalQuestions: quizzes.length
    });
    const savedResult = await result.save();

    res.status(201).json({ score, total: quizzes.length, resultId: savedResult._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addQuiz = async (req, res) => {
  try {
    const { topicId, question, options, correctAnswerIndex } = req.body;
    const quiz = new Quiz({ topic: topicId, question, options, correctAnswerIndex });
    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuizzesForTopic, submitQuiz, addQuiz };
