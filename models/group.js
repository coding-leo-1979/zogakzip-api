// models/group.js

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const GroupSchema = new mongoose.Schema({
    groupId: { type: Number },
    name: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isPublic: { type: Boolean, required: true },
    introduction: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    postCount: { type: Number, default: 0},
    posts: { type: [Number], default: [] }
});

// Auto-increment 설정
GroupSchema.plugin(AutoIncrement, { inc_field: 'groupId' });

module.exports = mongoose.model('Group', GroupSchema);