// models/comment.js

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const commentSchema = new mongoose.Schema({
    commentId: { type: Number },
    nickname: { type: String, required: true },
    content: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Auto-increment 설정
commentSchema.plugin(AutoIncrement, { inc_field: 'commentId' });

module.exports = mongoose.model('Comment', commentSchema);