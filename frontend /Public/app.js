// متغيرات عامة
let currentAnalysisData = null;
const API_URL = 'http://localhost:5000/api';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkServerHealth();
});

/**
 * إعداد مستمعي الأحداث
 */
function setupEventListeners() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    // الضغط على منطقة التحميل
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // السحب والإفلات
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.backgroundColor = '#f0f8ff';
        uploadZone.style.borderColor = 'var(--accent-color)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.backgroundColor = 'white';
        uploadZone.style.borderColor = 'var(--secondary-color)';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.backgroundColor = 'white';
        uploadZone.style.borderColor = 'var(--secondary-color)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    // اختيار الملف
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

/**
 * التحقق من صحة الخادم
 */
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
            console.log('✅ الخادم يعمل بشكل صحيح');
        }
    } catch (error) {
        console.warn('⚠️ الخادم غير متاح حالياً');
    }
}

/**
 * معالجة تحميل الملف
 */
async function handleFileUpload(file) {
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
        alert('نوع الملف غير مدعوم. يرجى تحميل صورة أو فيديو.');
        return;
    }

    // التحقق من حجم الملف
    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxSize) {
        alert('حجم الملف كبير جداً. الحد الأقصى هو 50 MB.');
        return;
    }

    // إظهار منطقة النتائج
    document.getElementById('resultsContainer').style.display = 'block';
    document.getElementById('uploadZone').style.display = 'none';

    // عرض معلومات الملف
    displayFileInfo(file);

    // بدء التحليل
    await analyzeFile(file);
}

/**
 * عرض معلومات الملف
 */
function displayFileInfo(file) {
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileType').textContent = file.type || 'غير معروف';
    document.getElementById('analysisTime').textContent = new Date().toLocaleString('ar-EG');
}

/**
 * تنسيق حجم الملف
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * تحليل الملف
 */
async function analyzeFile(file) {
    try {
        // إنشاء FormData
        const formData = new FormData();
        formData.append('file', file);

        // إرسال الملف للخادم
        const response = await fetch(`${API_URL}/analysis/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('فشل التحليل');
        }

        const result = await response.json();
        
        if (result.status === 'success') {
            currentAnalysisData = result.data;
            displayAnalysisResults(result.data);
        } else {
            throw new Error(result.error || 'حدث خطأ في التحليل');
        }

    } catch (error) {
        console.error('خطأ:', error);
        alert('حدث خطأ في التحليل: ' + error.message);
        resetAnalyzer();
    }
}

/**
 * عرض نتائج التحليل
 */
function displayAnalysisResults(data) {
    // تحديث شريط التقدم
    updateProgressBar(100);

    // عرض مقياس الأصالة
    displayAuthenticityMeter(data.authenticityScore);

    // عرض نتائج البيانات الوصفية
    displayMetadataResults(data.results.metadata);

    // عرض نتائج التزييف العميق
    displayDeepfakeResults(data.results.deepfake);
}

/**
 * تحديث شريط التقدم
 */
function updateProgressBar(percentage) {
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = percentage + '%';
}

/**
 * عرض مقياس الأصالة
 */
function displayAuthenticityMeter(score) {
    const meterFill = document.getElementById('meterFill');
    const authenticityScore = document.getElementById('authenticityScore');
    const verdict = document.getElementById('verdict');

    // تحديث الشريط
    meterFill.style.width = score + '%';
    authenticityScore.textContent = Math.round(score);

    // تحديث الحكم
    let verdictText = '';
    let verdictClass = '';

    if (score >= 80) {
        verdictText = '✅ الملف أصلي - لا توجد علامات تحذيرية';
        verdictClass = 'authentic';
    } else if (score >= 50) {
        verdictText = '⚠️ الملف مريب - قد يحتوي على تعديلات';
        verdictClass = 'suspicious';
    } else {
        verdictText = '❌ الملف مزيف - احتمالية عالية للتلاعب';
        verdictClass = 'fake';
    }

    verdict.textContent = verdictText;
    verdict.className = 'verdict ' + verdictClass;
}

/**
 * عرض نتائج البيانات الوصفية
 */
function displayMetadataResults(metadata) {
    const container = document.getElementById('metadataResults');
    
    let html = '<div style="display: grid; gap: 0.5rem;">';
    
    if (metadata.format) {
        html += `<p><strong>الصيغة:</strong> ${metadata.format}</p>`;
    }
    if (metadata.width && metadata.height) {
        html += `<p><strong>الأبعاد:</strong> ${metadata.width} × ${metadata.height}</p>`;
    }
    if (metadata.colorspace) {
        html += `<p><strong>نموذج الألوان:</strong> ${metadata.colorspace}</p>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * عرض نتائج التزييف العميق
 */
function displayDeepfakeResults(deepfake) {
    const container = document.getElementById('deepfakeResults');
    
    let html = '<div style="display: grid; gap: 0.5rem;">';
    
    if (deepfake.probability !== undefined) {
        const percentage = Math.round(deepfake.probability * 100);
        html += `<p><strong>احتمالية التزييف:</strong> ${percentage}%</p>`;
    }
    
    if (deepfake.isDeepfake !== undefined) {
        const status = deepfake.isDeepfake ? '❌ نعم' : '✅ لا';
        html += `<p><strong>هل هو تزييف عميق؟</strong> ${status}</p>`;
    }
    
    if (deepfake.isAIGenerated !== undefined) {
        const status = deepfake.isAIGenerated ? '❌ نعم' : '✅ لا';
        html += `<p><strong>هل هو مولد بالذكاء الاصطناعي؟</strong> ${status}</p>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * إنشاء تقرير PDF
 */
function generateReport() {
    if (!currentAnalysisData) {
        alert('لا توجد بيانات تحليل لإنشاء تقرير');
        return;
    }

    // هنا يتم إنشاء التقرير
    alert('جاري إنشاء التقرير PDF...\nسيتم تحميل التقرير قريباً.');
}

/**
 * تحميل JSON
 */
function downloadJSON() {
    if (!currentAnalysisData) {
        alert('لا توجد بيانات تحليل للتحميل');
        return;
    }

    const dataStr = JSON.stringify(currentAnalysisData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yaqeen-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * إعادة تعيين المحلل
 */
function resetAnalyzer() {
    document.getElementById('uploadZone').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('fileInput').value = '';
    currentAnalysisData = null;
}

/**
 * التمرير إلى المحلل
 */
function scrollToAnalyzer() {
    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth' });
}

