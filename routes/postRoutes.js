// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const { updatePost } = require('../controllers/postController');

// 게시글 수정
router.put('/posts/:postId', updatePost);

module.exports = router;