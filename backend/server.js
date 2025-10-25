import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// استيراد المسارات
import analysisRoutes from './routes/analysis.js';
import reportRoutes from './routes/report.js';
import healthRoutes from './routes/health.js';

// إعداد المتغيرات البيئية
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// إنشاء مجلد التحميلات إذا لم يكن موجوداً
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// إعداد multer لتحميل الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50000000
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'));
    }
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// المسارات
app.use('/api/analysis', analysisRoutes(upload));
app.use('/api/reports', reportRoutes);
app.use('/api/health', healthRoutes);

// مسار الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    name: 'Yaqeen - برهان الحقيقة',
    version: '1.0.0',
    description: 'منصة ذكاء اصطناعي للكشف عن التلاعب بالوسائط والتحقق من أصالة الصور',
    author: 'Hassan Mohamed Hassan Ahmed',
    status: 'running'
  });
});

// معالج الأخطاء
app.use((err, req, res, next) => {
  console.error('خطأ:', err);
  res.status(err.status || 500).json({
    error: err.message || 'حدث خطأ في الخادم',
    status: 'error'
  });
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`✅ خادم Yaqeen يعمل على المنفذ ${PORT}`);
  console.log(`📍 الرابط: http://localhost:${PORT}`);
  console.log(`🔐 البيئة: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

