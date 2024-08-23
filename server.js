const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

// 환경 변수 설정
require('dotenv').config();

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer-Storage-Cloudinary 설정
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary에서 이미지를 저장할 폴더 이름
    format: async (req, file) => 'png', // 파일 포맷 (예: 'jpeg', 'png')
    public_id: (req, file) => file.originalname, // 파일 이름
  },
});

const upload = multer({ storage });

const app = express();

// MongoDB 연결
connectDB();

// CORS 설정
app.use(cors());

// JSON 파싱 미들웨어
app.use(express.json());

// 그룹 라우트 설정
app.use('/api', groupRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

// 이미지 업로드 및 URL 생성 라우트
app.post('/api/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지 업로드 실패' });
  }
  const imageUrl = req.file.path; // Cloudinary에서 제공한 이미지 URL
  res.status(200).json({ imageUrl });
});

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