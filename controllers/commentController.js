// controllers/commentController.js

const Comment = require('../models/comment');
const Post = require('../models/post');

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
        if (comment.password !== password) {
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
        if (comment.password !== password) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 댓글 삭제
        await comment.deleteOne();

        // 댓글이 속한 게시글에서 commentId 삭제
        await Post.updateOne(
            { comments: commentId },
            { $pull: { comments: commentId } }
        );

        // 성공 응답
        res.status(200).json({ message: '답글 삭제 성공' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};