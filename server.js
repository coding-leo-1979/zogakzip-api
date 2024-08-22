// server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

// 환경 변수 설정
require('dotenv').config();

const app = express();

// MongoDB 연결
connectDB();

// CORS 설정
app.use(cors());
/*
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
*/

// JSON 파싱 미들웨어
app.use(express.json());

// 그룹 라우트 설정
app.use('/api', groupRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

// 정적 파일 서빙 (프론트엔드와 함께 배포할 때 필요)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public')); // 예: React 앱을 배포할 때 'build' 폴더를 서빙
}

// 기본 라우트 (서버가 잘 작동하는지 확인하는 용도)
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));