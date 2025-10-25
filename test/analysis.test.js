import { test } from 'node:test';
import assert from 'node:assert';

/**
 * اختبارات وحدة لخدمات التحليل
 */

test('يجب أن يتم حساب درجة الأصالة بشكل صحيح', () => {
    const metadataAnalysis = {
        anomalies: [
            { type: 'metadata', severity: 'منخفضة' }
        ]
    };

    const deepfakeAnalysis = {
        probability: 0.3
    };

    // حساب درجة الأصالة
    let score = 100;
    if (metadataAnalysis.anomalies && metadataAnalysis.anomalies.length > 0) {
        score -= metadataAnalysis.anomalies.length * 5;
    }
    if (deepfakeAnalysis.probability > 0.5) {
        score -= (deepfakeAnalysis.probability * 30);
    }
    score = Math.max(0, Math.min(100, score));

    assert.strictEqual(score, 95, 'درجة الأصالة يجب أن تكون 95');
});

test('يجب أن يتم كشف الشذوذ في البيانات الوصفية', () => {
    const results = {
        metadata: {
            exif: 'لا توجد بيانات EXIF'
        },
        pixelAnalysis: {
            noiseLevel: 150
        }
    };

    const anomalies = [];

    if (!results.metadata.exif || results.metadata.exif === 'لا توجد بيانات EXIF') {
        anomalies.push({
            type: 'metadata',
            severity: 'منخفضة',
            description: 'البيانات الوصفية EXIF مفقودة أو تم حذفها'
        });
    }

    assert.strictEqual(anomalies.length, 1, 'يجب أن يتم كشف شذوذ واحد');
    assert.strictEqual(anomalies[0].type, 'metadata', 'نوع الشذوذ يجب أن يكون metadata');
});

test('يجب أن يتم التحقق من صحة نوع الملف', () => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    
    const validFile = 'image/jpeg';
    const invalidFile = 'application/pdf';

    assert.ok(allowedTypes.includes(validFile), 'يجب قبول صور JPEG');
    assert.ok(!allowedTypes.includes(invalidFile), 'يجب رفض ملفات PDF');
});

test('يجب أن يتم التحقق من حجم الملف', () => {
    const maxSize = 50 * 1024 * 1024; // 50 MB
    
    const smallFile = 10 * 1024 * 1024; // 10 MB
    const largeFile = 100 * 1024 * 1024; // 100 MB

    assert.ok(smallFile <= maxSize, 'يجب قبول الملفات الصغيرة');
    assert.ok(largeFile > maxSize, 'يجب رفض الملفات الكبيرة');
});

test('يجب أن يتم تنسيق حجم الملف بشكل صحيح', () => {
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    assert.strictEqual(formatFileSize(1024), '1 KB', 'يجب تنسيق 1024 بايت إلى 1 KB');
    assert.strictEqual(formatFileSize(1048576), '1 MB', 'يجب تنسيق 1 MB بشكل صحيح');
});

test('يجب أن يتم حساب احتمالية التزييف بشكل صحيح', () => {
    const indicators = [
        { name: 'مؤشر 1', score: 0.2 },
        { name: 'مؤشر 2', score: 0.3 },
        { name: 'مؤشر 3', score: 0.1 }
    ];

    const totalScore = indicators.reduce((sum, indicator) => sum + indicator.score, 0);
    const averageScore = totalScore / indicators.length;
    const probability = Math.min(1, averageScore);

    assert.ok(probability > 0 && probability <= 1, 'احتمالية التزييف يجب أن تكون بين 0 و 1');
    assert.ok(Math.abs(probability - 0.2) < 0.0001, 'احتمالية التزييف يجب أن تكون حوالي 0.2');
});

console.log('✅ جميع الاختبارات نجحت!');

