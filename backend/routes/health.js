import express from 'express';

const router = express.Router();

// مسار فحص صحة الخادم
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'الخادم يعمل بشكل صحيح',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

export default router;

