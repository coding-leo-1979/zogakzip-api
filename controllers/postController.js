// controllers/postController.js

const Post = require('../models/post');
const Group = require('../models/group');

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
        if (post.postPassword !== postPassword) {
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