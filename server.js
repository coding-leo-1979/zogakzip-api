const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// JSON 파싱 미들웨어
app.use(express.json());

// 업로드 디렉토리 확인 및 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 이미지 업로드 라우트 추가
app.post('/api/image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '이미지 업로드 실패' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

app.use('/uploads', express.static(uploadDir));

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