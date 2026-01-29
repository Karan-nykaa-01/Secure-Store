const express = require('express');
const router = express.Router();
const { upload } = require('../lib/multer');
const authMiddleware = require('../middleware/auth');

const { uploadImage, getUploadHistory } = require('../controllers/aws');

router.post('/upload', authMiddleware, upload.single('image'), uploadImage);
router.get('/history', authMiddleware, getUploadHistory);

module.exports = router;