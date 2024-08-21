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
        if (post.postPassword !== postPassword) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

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
        if (post.postPassword !== password) {
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
exports.getPostVisibility = async (req, res) => {
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