const express = require('express');
const router = express.Router();
const { upload } = require('../lib/multer');
const authMiddleware = require('../middleware/auth');

const { uploadImage, getUploadHistory, getDirectories } = require('../controllers/aws');

router.post('/upload', authMiddleware, upload.single('image'), uploadImage);
router.get('/history', authMiddleware, getUploadHistory);
router.get('/directories', authMiddleware, getDirectories);

module.exports = router;