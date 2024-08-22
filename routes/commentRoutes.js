// routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const { updateComment, deleteComment } = require('../controllers/commentController');

// 댓글 수정 라우트
router.put('/comments/:commentId', updateComment);

// 댓글 삭제 라우트
router.delete('/comments/:commentId', deleteComment);

module.exports = router;