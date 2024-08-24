// controllers/groupController.js

const Group = require('../models/group');
const Post = require('../models/post');

// 그룹 등록
exports.createGroup = async (req, res) => {
    try {
        const { name, password, imageUrl, isPublic, introduction } = req.body;

        // 그룹 생성
        const newGroup = new Group({
            // 사용자 입력 필드
            name,
            password,
            imageUrl,
            isPublic,
            introduction,
            // 자동 생성 필드
            likeCount: 0,
            badges: [],
            postCount: 0,
            createdAt: new Date(),
        });

        const savedGroup = await newGroup.save();

        res.status(201).json({
            id: savedGroup.groupId,
            name: savedGroup.name,
            imageUrl: savedGroup.imageUrl,
            isPublic: savedGroup.isPublic,
            likeCount: savedGroup.likeCount,
            badges: savedGroup.badges,
            postCount: savedGroup.postCount,
            createdAt: savedGroup.createdAt,
            introduction: savedGroup.introduction,
        });
    } catch (err) {
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 그룹 목록 조회
exports.getGroups = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

        // 페이지네이션 및 정렬 설정
        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);

        // 정렬 기준
        let sortCriteria;
        switch (sortBy) {
            case 'mostPosted':
                sortCriteria = { postCount: -1 };
                break;
            case 'mostLiked':
                sortCriteria = { likeCount: -1 };
                break;
            case 'mostBadge':
                sortCriteria = { badgeCount: -1 };
                break;
            case 'latest':
            default:
                sortCriteria = { createdAt: -1 };
                break;
        }

        // 필터링 조건
        const filter = {};

        if (keyword) {
            filter.name = { $regex: keyword, $options: 'i' };
        }

        if (isPublic === 'true') {
            filter.isPublic = true;
        } else if (isPublic === 'false') {
            filter.isPublic = false;
        }

        // 데이터 조회
        const totalItemCount = await Group.countDocuments(filter);
        const totalPages = Math.ceil(totalItemCount / limit);
        const groups = await Group.find(filter)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)
            .exec();

        // 응답 반환
        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItemCount,
            data: groups.map(group => ({
                id: group.groupId,
                name: group.name,
                imageUrl: group.imageUrl,
                isPublic: group.isPublic,
                likeCount: group.likeCount,
                badgeCount: group.badges.length,
                postCount: group.postCount,
                createdAt: group.createdAt,
                introduction: group.introduction,
            }))
        });
    } catch (err) {
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 그룹 수정
exports.updateGroup = async (req, res) => {
    const { groupId } = req.params;
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    try {
        // 그룹 찾기
        const group = await Group.findOne({ groupId: groupId });

        // 그룹 없음
        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 틀림
        if (group.password !== password) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 그룹 정보 업데이트
        group.name = name;
        group.imageUrl = imageUrl;
        group.isPublic = isPublic;
        group.introduction = introduction;

        const updatedGroup = await group.save();

        res.status(200).json({
            id: updatedGroup.groupId,
            name: updatedGroup.name,
            imageUrl: updatedGroup.imageUrl,
            isPublic: updatedGroup.isPublic,
            likeCount: updatedGroup.likeCount,
            badges: updatedGroup.badges,
            postCount: updatedGroup.postCount,
            createdAt: updatedGroup.createdAt,
            introduction: updatedGroup.introduction,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 그룹 삭제
exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    try {
        // 그룹 찾기
        const group = await Group.findOne({ groupId: groupId });

        // 그룹 없음
        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 틀림
        if (group.password !== password) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 그룹 삭제
        await Group.deleteOne({ groupId: groupId });

        res.status(200).json({ message: '그룹 삭제 성공' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 그룹 상세 정보 조회
exports.getGroupDetails = async (req, res) => {
    const { groupId } = req.params;

    try {
        // 그룹 찾기
        const group = await Group.findOne({ groupId: groupId });

        // 그룹 없음
        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 그룹 정보 반환
        res.status(200).json({
            id: group.groupId,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            likeCount: group.likeCount,
            badges: group.badges,
            postCount: group.postCount,
            createdAt: group.createdAt,
            introduction: group.introduction,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 그룹 조회 권환 확인
exports.verifyGroupPassword = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    try {
        // 그룹 찾기
        const group = await Group.findOne({ groupId: groupId });

        // 그룹 없음
        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 비밀번호 확인
        if (group.password !== password) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 비밀번호 확인 성공
        res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 그룹 공감하기
exports.likeGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        // 그룹 찾기
        const group = await Group.findOne({ groupId: groupId });

        // 그룹 없음
        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 공감 수 증가
        group.likeCount += 1;

        // 업데이트된 그룹 저장
        await group.save();

        // 성공 응답
        res.status(200).json({ message: '그룹 공감하기 성공' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 그룹 공개 여부 확인
exports.checkGroupPublic = async (req, res) => {
    const { groupId } = req.params;

    try {
        // 그룹 찾기
        const group = await Group.findOne({ groupId: groupId });

        // 그룹 없음
        if (!group) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        // 공개 여부 응답
        res.status(200).json({
            id: group.groupId,
            isPublic: group.isPublic,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 게시글 등록
exports.createPost = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic } = req.body;

        // 그룹 비밀번호 확인
        const group = await Group.findOne({ groupId });
        if (!group) {
            return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });
        }
        if (group.password !== groupPassword) {
            return res.status(403).json({ message: '그룹 비밀번호가 틀렸습니다' });
        }

        // 게시글 생성
        const newPost = new Post({
            groupId,
            nickname,
            title,
            content,
            postPassword,
            groupPassword,
            imageUrl,
            tags,
            location,
            moment,
            isPublic,
        });

        const savedPost = await newPost.save();

        group.posts.push(savedPost.id);
        group.postCount = group.posts.length;
        await group.save();

        res.status(200).json({
            id: savedPost.id,
            groupId: savedPost.groupId,
            nickname: savedPost.nickname,
            title: savedPost.title,
            content: savedPost.content,
            imageUrl: savedPost.imageUrl,
            tags: savedPost.tags,
            location: savedPost.location,
            moment: savedPost.moment,
            isPublic: savedPost.isPublic,
            likeCount: savedPost.likeCount,
            commentCount: savedPost.commentCount,
            createdAt: savedPost.createdAt,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};
// 게시글 목록 조회
exports.getPosts = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

        // 페이지네이션 및 정렬 설정
        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);

        // 정렬 기준
        let sortCriteria;
        switch (sortBy) {
            case 'mostCommented':
                sortCriteria = { commentCount: -1 };
                break;
            case 'mostLiked':
                sortCriteria = { likeCount: -1 };
                break;
            case 'latest':
            default:
                sortCriteria = { createdAt: -1 };
                break;
        }

        // 그룹 확인
        const group = await Group.findOne({ groupId: groupId });
        if (!group) {
            return res.status(404).json({ message: '존재하지 않는 그룹입니다' });
        }

        // 게시글 필터링 조건
        const filter = { groupId };

        if (keyword) {
            filter.title = { $regex: keyword, $options: 'i' };
        }
        if (isPublic === 'true') {
            filter.isPublic = true;
        } else if (isPublic === 'false') {
            filter.isPublic = false;
        }

        // 데이터 조회
        const totalItemCount = await Post.countDocuments(filter);
        const totalPages = Math.ceil(totalItemCount / limit);
        const posts = await Post.find(filter)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit)
            .exec();

        // 응답 반환
        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItemCount,
            data: posts.map(post => ({
                id: post.id,
                nickname: post.nickname,
                title: post.title,
                imageUrl: post.imageUrl,
                tags: post.tags,
                location: post.location,
                moment: post.moment,
                isPublic: post.isPublic,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                createdAt: post.createdAt,
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: '잘못된 요청입니다' });
    }
};