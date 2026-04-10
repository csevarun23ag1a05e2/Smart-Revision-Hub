const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterials, deleteMaterial } = require('../controllers/materialController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/topic/:topicId').get(protect, getMaterials);
router.route('/').post(protect, upload.single('file'), uploadMaterial);
router.route('/:id').delete(protect, deleteMaterial);

module.exports = router;
