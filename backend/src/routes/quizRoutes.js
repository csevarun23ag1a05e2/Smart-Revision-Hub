const express = require('express');
const router = express.Router();
const { getQuizzesForTopic, submitQuiz, addQuiz } = require('../controllers/quizController');
const { protect, admin } = require('../middleware/auth');

router.route('/topic/:topicId').get(protect, getQuizzesForTopic);
router.route('/submit').post(protect, submitQuiz);
router.route('/').post(protect, admin, addQuiz);

module.exports = router;
