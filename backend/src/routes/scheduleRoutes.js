const express = require('express');
const router = express.Router();
const { getSchedules, markComplete } = require('../controllers/scheduleController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getSchedules);
router.route('/:id/complete').put(protect, markComplete);

module.exports = router;
