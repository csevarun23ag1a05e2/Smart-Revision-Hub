const express = require('express');
const router = express.Router();
const { getTopics, createTopic, deleteTopic } = require('../controllers/topicController');
const { protect } = require('../middleware/auth');

router.route('/subject/:subjectId').get(protect, getTopics).post(protect, createTopic);
router.route('/:id').delete(protect, deleteTopic);

module.exports = router;
