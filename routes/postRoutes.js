// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const { updatePost, deletePost, getPost, verifyPostPassword, likePost, getPostVisibility } = require('../controllers/postController');

// 게시글 수정
router.put('/posts/:postId', updatePost);

// 게시글 삭제
router.delete('/posts/:postId', deletePost);

// 게시글 상세 조회
router.get('/posts/:postId', getPost);

// 게시글 조회 권한 확인
router.post('/posts/:postId/verify-password', verifyPostPassword);

// 게시글 공감하기
router.post('/posts/:postId/like', likePost);

// 게시글 공개 여부 확인
router.get('/posts/:postId/is-public', getPostVisibility);

module.exports = router;