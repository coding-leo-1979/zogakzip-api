// routes/groupRoutes.js

const express = require('express');
const router = express.Router();
const { createGroup, updateGroup, getGroups, deleteGroup, getGroupDetails, verifyGroupPassword, likeGroup, checkGroupPublic, createPost, getPosts } = require('../controllers/groupController');

// 그룹 등록 라우트
router.post('/groups', createGroup);

// 그룹 목록 조회 라우트
router.get('/groups', getGroups);

// 그룹 수정 라우트
router.put('/groups/:groupId', updateGroup);

// 그룹 삭제 라우트
router.delete('/groups/:groupId', deleteGroup);

// 그룹 상세 조회 라우트
router.get('/groups/:groupId', getGroupDetails);

// 그룹 조회 권한 확인 라우트
router.post('/groups/:groupId/verify-password', verifyGroupPassword);

// 그룹 공감하기 라우트
router.post('/groups/:groupId/like', likeGroup);

// 그룹 공개 여부 확인 라우트
router.get('/groups/:groupId/is-public', checkGroupPublic);

// 게시글 등록 라우트
router.post('/groups/:groupId/posts', createPost);

// 게시글 목록 조회 라우트
router.get('/groups/:groupId/posts', getPosts);

module.exports = router;