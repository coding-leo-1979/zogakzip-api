// controllers/postController.js

const Group = require('../models/group');
const Post = require('../models/post');
const Comment = require('../models/comment');

const bcrypt = require('bcryptjs');

// 게시글 수정
exports.updatePost = async (req, res) => {
    const { postId } = req.params;
    const { nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic } = req.body;

    try {
        // 게시글 찾기
        const post = await Post.findOne({ id: postId });

        // 게시글 없음
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 게시글 비밀번호 확인
        const isPasswordMatch = await bcrypt.compare(postPassword, post.postPassword);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 게시글 업데이트
        post.nickname = nickname;
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        post.tags = tags;
        post.location = location;
        post.moment = moment;
        post.isPublic = isPublic;

        const updatedPost = await post.save();

        // 성공 응답
        res.status(200).json({
            id: updatedPost.id,
            groupId: updatedPost.groupId,
            nickname: updatedPost.nickname,
            title: updatedPost.title,
            content: updatedPost.content,
            imageUrl: updatedPost.imageUrl,
            tags: updatedPost.tags,
            location: updatedPost.location,
            moment: updatedPost.moment,
            isPublic: updatedPost.isPublic,
            likeCount: updatedPost.likeCount,
            commentCount: updatedPost.commentCount,
            createdAt: updatedPost.createdAt
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 게시글 삭제
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { postPassword } = req.body;

        // 게시글 찾기
        const post = await Post.findOne({ id: postId });

        // 게시글 없음
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 확인
        const isPasswordMatch = await bcrypt.compare(postPassword, post.postPassword);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 해당 그룹에서 posts 배열에서 postId 제거 및 postCount 업데이트
        const group = await Group.findOneAndUpdate(
            { groupId: post.groupId },
            { 
                $pull: { posts: postId }, // posts 배열에서 postId 제거
            },
            { new: true } // 업데이트된 문서를 반환
        );

        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });
        }

        // 업데이트된 posts 배열의 길이를 postCount에 반영
        group.postCount = group.posts.length;
        await group.save();

        // 게시글 삭제
        await Post.findOneAndDelete({ id: postId });

        return res.status(200).json({ message: "게시글 삭제 성공" });
    } catch (error) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
    }
};
// 게시글 상세 정보 조회
exports.getPost = async (req, res) => {
    const { postId } = req.params;

    try {
        // 게시글 찾기
        const post = await Post.findOne({ id: postId });

        // 게시글 없음
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 성공 응답
        res.status(200).json({
            id: post.id,
            groupId: post.groupId,
            nickname: post.nickname,
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
            tags: post.tags,
            location: post.location,
            moment: post.moment,
            isPublic: post.isPublic,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            createdAt: post.createdAt
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 게시글 조회 권한 확인
exports.verifyPostPassword = async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;

    try {
        // 게시글 찾기
        const post = await Post.findOne({ id: postId });

        // 게시글 없음
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 확인
        const isPasswordMatch = await bcrypt.compare(password, post.postPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 비밀번호 확인 성공
        res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 게시글 공감하기
exports.likePost = async (req, res) => {
    const { postId } = req.params;

    try {
        // 게시글 찾기
        const post = await Post.findOne({ id: postId });

        // 게시글 없음
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 공감 카운트 증가
        post.likeCount += 1;

        // 업데이트된 게시글 저장
        await post.save();

        // 성공 응답
        res.status(200).json({ message: '게시글 공감하기 성공' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 게시글 공개 여부 확인
exports.checkPostVisibility = async (req, res) => {
    const { postId } = req.params;

    try {
        // 게시글 찾기
        const post = await Post.findOne({ id: postId });

        // 게시글 없음
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 공개 여부 응답
        res.status(200).json({
            id: post.id,
            isPublic: post.isPublic,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 댓글 등록
exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { nickname, content, password } = req.body;

    try {
        // 게시글 찾기
        const post = await Post.findOne({ id: postId });
        if (!post) {
            return res.status(404).json({ message: '게시글이 존재하지 않습니다' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10); // 10은 saltRounds 값으로, 보안 강도를 설정합니다.

        // 댓글 생성
        const newComment = new Comment({ nickname, content, password: hashedPassword });
        const savedComment = await newComment.save();

        // 게시글에 댓글 ID 추가
        post.comments.push(savedComment.commentId);
        post.commentCount = post.comments.length;
        await post.save();

        // 성공 응답
        res.status(200).json({
            id: savedComment.commentId,
            nickname: savedComment.nickname,
            content: savedComment.content,
            createdAt: savedComment.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 댓글 목록 조회
exports.getComments = async (req, res) => {
    const { postId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    try {
        // 게시글 찾기
        const post = await Post.findOne({ id: postId });
        if (!post) {
            return res.status(404).json({ message: '게시글이 존재하지 않습니다' });
        }

        // 댓글 목록 조회
        const comments = await Comment.find({ commentId: { $in: post.comments } }) // post.commentIds -> post.comments로 변경
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        const totalComments = await Comment.countDocuments({ commentId: { $in: post.comments } }); // post.commentIds -> post.comments로 변경
        const totalPages = Math.ceil(totalComments / pageSize);

        // 데이터 형식 변환
        const formattedComments = comments.map(comment => ({
            id: comment.commentId,
            nickname: comment.nickname,
            content: comment.content,
            createdAt: comment.createdAt
        }));

        // 성공 응답
        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItemCount: totalComments,
            data: formattedComments
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};