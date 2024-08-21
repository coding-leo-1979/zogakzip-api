// models/post.js

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const postSchema = new mongoose.Schema({
    groupId: { type: Number, required: true },
    nickname: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    postPassword: { type: String, required: true },
    groupPassword: { type: String, required: true },
    imageUrl: { type: String },
    tags: [String],
    location: { type: String },
    moment: { type: Date, required: true },
    isPublic: { type: Boolean, default: true },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Auto-increment 설정
postSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Post', postSchema);