import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../yaqeen.db');
const db = new Database(dbPath);

// تفعيل المفاتيح الأجنبية
db.pragma('foreign_keys = ON');

/**
 * إنشاء جداول قاعدة البيانات
 */
export function initializeDatabase() {
    try {
        // جدول التحليلات
        db.exec(`
            CREATE TABLE IF NOT EXISTS analyses (
                id TEXT PRIMARY KEY,
                fileName TEXT NOT NULL,
                fileSize INTEGER NOT NULL,
                mimeType TEXT NOT NULL,
                fileHash TEXT NOT NULL,
                authenticityScore REAL NOT NULL,
                uploadTime DATETIME DEFAULT CURRENT_TIMESTAMP,
                analysisStatus TEXT DEFAULT 'مكتمل',
                metadataResults TEXT,
                deepfakeResults TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // جدول التقارير
        db.exec(`
            CREATE TABLE IF NOT EXISTS reports (
                id TEXT PRIMARY KEY,
                analysisId TEXT NOT NULL,
                format TEXT NOT NULL,
                filePath TEXT,
                generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (analysisId) REFERENCES analyses(id)
            )
        `);

        // جدول السجلات
        db.exec(`
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                details TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
        throw error;
    }
}

/**
 * حفظ نتائج التحليل
 */
export function saveAnalysis(analysisData) {
    try {
        const id = generateId();
        const stmt = db.prepare(`
            INSERT INTO analyses (
                id, fileName, fileSize, mimeType, fileHash,
                authenticityScore, uploadTime, analysisStatus,
                metadataResults, deepfakeResults
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            analysisData.fileName,
            analysisData.fileSize,
            analysisData.mimeType,
            analysisData.fileHash,
            analysisData.authenticityScore,
            analysisData.uploadTime,
            analysisData.analysisStatus,
            JSON.stringify(analysisData.results.metadata),
            JSON.stringify(analysisData.results.deepfake)
        );

        return id;
    } catch (error) {
        console.error('❌ خطأ في حفظ التحليل:', error);
        throw error;
    }
}

/**
 * جلب نتائج التحليل
 */
export function getAnalysis(id) {
    try {
        const stmt = db.prepare('SELECT * FROM analyses WHERE id = ?');
        const analysis = stmt.get(id);

        if (analysis) {
            analysis.metadataResults = JSON.parse(analysis.metadataResults);
            analysis.deepfakeResults = JSON.parse(analysis.deepfakeResults);
        }

        return analysis;
    } catch (error) {
        console.error('❌ خطأ في جلب التحليل:', error);
        throw error;
    }
}

/**
 * حفظ التقرير
 */
export function saveReport(reportData) {
    try {
        const id = generateId();
        const stmt = db.prepare(`
            INSERT INTO reports (id, analysisId, format, filePath)
            VALUES (?, ?, ?, ?)
        `);

        stmt.run(id, reportData.analysisId, reportData.format, reportData.filePath);
        return id;
    } catch (error) {
        console.error('❌ خطأ في حفظ التقرير:', error);
        throw error;
    }
}

/**
 * تسجيل إجراء
 */
export function logAction(action, details) {
    try {
        const stmt = db.prepare('INSERT INTO logs (action, details) VALUES (?, ?)');
        stmt.run(action, details);
    } catch (error) {
        console.error('❌ خطأ في تسجيل الإجراء:', error);
    }
}

/**
 * توليد معرف فريد
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * إغلاق قاعدة البيانات
 */
export function closeDatabase() {
    db.close();
}

export default db;

