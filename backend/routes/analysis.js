import express from 'express';
import sharp from 'sharp';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performForensicAnalysis } from '../services/forensics.js';
import { detectDeepfake } from '../services/deepfake-detector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function analysisRoutes(upload) {
  const router = express.Router();

  // مسار تحميل وتحليل الملف
  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'لم يتم تحميل أي ملف',
          status: 'error'
        });
      }

      const filePath = req.file.path;
      const fileName = req.file.originalname;
      const fileSize = req.file.size;
      const mimeType = req.file.mimetype;

      // حساب hash الملف الأصلي
      const fileHash = await calculateFileHash(filePath);

      // بدء التحليل
      const analysisResults = {
        fileName,
        fileSize,
        mimeType,
        fileHash,
        uploadTime: new Date().toISOString(),
        analysisStatus: 'في المعالجة',
        results: {}
      };

      // تحليل البيانات الوصفية
      const metadataAnalysis = await performForensicAnalysis(filePath, mimeType);
      analysisResults.results.metadata = metadataAnalysis;

      // كشف التزييف العميق والذكاء الاصطناعي
      const deepfakeAnalysis = await detectDeepfake(filePath, mimeType);
      analysisResults.results.deepfake = deepfakeAnalysis;

      // حساب درجة الأصالة
      const authenticityScore = calculateAuthenticityScore(
        metadataAnalysis,
        deepfakeAnalysis
      );
      analysisResults.authenticityScore = authenticityScore;
      analysisResults.analysisStatus = 'مكتمل';

      res.json({
        status: 'success',
        message: 'تم تحليل الملف بنجاح',
        data: analysisResults
      });

    } catch (error) {
      console.error('خطأ في التحليل:', error);
      res.status(500).json({
        error: error.message || 'حدث خطأ في التحليل',
        status: 'error'
      });
    }
  });

  // مسار الحصول على تفاصيل التحليل
  router.get('/:analysisId', async (req, res) => {
    try {
      const { analysisId } = req.params;
      
      // هنا يمكن جلب البيانات من قاعدة البيانات
      res.json({
        status: 'success',
        message: 'تم جلب تفاصيل التحليل',
        data: {
          analysisId,
          // بيانات التحليل ستأتي من قاعدة البيانات
        }
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        status: 'error'
      });
    }
  });

  return router;
}

// دالة حساب hash الملف
async function calculateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      hash.update(data);
    });

    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });

    stream.on('error', reject);
  });
}

// دالة حساب درجة الأصالة
function calculateAuthenticityScore(metadataAnalysis, deepfakeAnalysis) {
  let score = 100;

  // تقليل الدرجة بناءً على نتائج التحليل
  if (metadataAnalysis.anomalies && metadataAnalysis.anomalies.length > 0) {
    score -= metadataAnalysis.anomalies.length * 5;
  }

  if (deepfakeAnalysis.probability > 0.5) {
    score -= (deepfakeAnalysis.probability * 30);
  }

  return Math.max(0, Math.min(100, score));
}

