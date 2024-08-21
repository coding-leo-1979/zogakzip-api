// server.js

const express = require('express');
const connectDB = require('./config/db');
const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');

// 환경 변수 설정
require('dotenv').config();

const app = express();

// MongoDB 연결
connectDB();

// JSON 파싱 미들웨어
app.use(express.json());

// 그룹 라우트 설정
app.use('/api', groupRoutes);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));