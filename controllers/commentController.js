// controllers/commentController.js

const Comment = require('../models/comment');
const Post = require('../models/post');

const bcrypt = require('bcryptjs');

// 댓글 수정
exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { nickname, content, password } = req.body;

    try {
        // 댓글 찾기
        const comment = await Comment.findOne({ commentId: parseInt(commentId) });

        // 댓글 없음
        if (!comment) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, comment.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 댓글 업데이트
        comment.nickname = nickname || comment.nickname;
        comment.content = content || comment.content;
        await comment.save();

        // 성공 응답
        res.status(200).json({
            id: comment.commentId,
            nickname: comment.nickname,
            content: comment.content,
            createdAt: comment.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 댓글 삭제
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;

    try {
        // 댓글 찾기
        const comment = await Comment.findOne({ commentId: parseInt(commentId) });
        if (!comment) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, comment.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 댓글이 속한 게시글에서 comments 배열에서 commentId 삭제 및 commentCount 업데이트
        const post = await Post.findOneAndUpdate(
            { comments: commentId },
            { $pull: { comments: commentId } }, // comments 배열에서 commentId 제거
            { new: true } // 업데이트된 문서를 반환
        );

        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
        }

        // 업데이트된 comments 배열의 길이를 commentCount에 반영
        post.commentCount = post.comments.length;
        await post.save();

        // 댓글 삭제
        await comment.deleteOne();

        // 성공 응답
        res.status(200).json({ message: '답글 삭제 성공' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};