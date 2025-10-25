# Yaqeen - Proof of Truth

![Yaqeen Logo](./assets/logo.png)

**Yaqeen** is an advanced and revolutionary artificial intelligence platform for detecting media tampering and verifying the authenticity of images and videos. It has been developed for use by investigators, journalists, and digital forensics specialists.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Forensic Documentation](#forensic-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 🎯 Overview

In the era of deepfakes and AI-generated images, verifying the authenticity of media has become essential. **Yaqeen** provides a comprehensive solution that combines digital forensics techniques with artificial intelligence to detect:

- **Traditional Tampering**: Splicing, cloning, and recompression
- **Deepfakes**: Fake videos and images created with deep learning
- **AI-Generated Images**: Images created entirely by GAN or Diffusion models

---

## ✨ Key Features

### 1. Metadata Analysis
- Comprehensive examination of **EXIF**, **XMP**, and **IPTC** data
- Detection of inconsistencies and anomalies in metadata
- Identification of creation date and camera used

### 2. Pixel-Level Tampering Detection
- Noise level analysis (PRNU - Photo Response Non-Uniformity)
- Cloning and splicing detection
- Error Level Analysis (ELA)

### 3. Deepfake and AI Detection
- Deep learning models trained on specialized datasets
- Detection of unnatural visual markers
- Determination of whether an image is fully generated or a manipulated real image

### 4. Interactive Authenticity Meter
- Clear and reliable score from 0 to 100%
- Bar chart display of analysis results
- Classification: Authentic, Suspicious, or Fake

### 5. Evidence Heatmap Overlay
- Visual display of suspicious areas in the image
- Highlighting of detected tampering areas
- Side-by-side comparison with original image

### 6. Forensic Documentation
- **SHA-256** hash calculation for files
- Ensuring Chain of Custody
- Comprehensive logging of all steps

### 7. Professional Reports
- Detailed **PDF** reports
- **JSON** reports for automated processing
- Comprehensive summary of findings and recommendations

---

## 📦 Requirements

### System Requirements
- **Node.js** 16.0 or higher
- **npm** or **pnpm**
- **Python** 3.8 or higher (optional, for advanced models)

### Core Libraries
```json
{
  "express": "^4.18.2",
  "sharp": "^0.32.6",
  "multer": "^1.4.5-lts.1",
  "better-sqlite3": "^9.0.0",
  "axios": "^1.6.2"
}
```

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/kush-king249/yaqeen.git
cd yaqeen
```

### 2. Install Dependencies
```bash
npm install
```

Or using pnpm:
```bash
pnpm install
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env
```

Then edit the `.env` file according to your needs:
```env
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=./yaqeen.db
MAX_FILE_SIZE=50000000
UPLOAD_DIR=./uploads
```

### 4. Initialize Database
```bash
npm run init-db
```

---

## 💻 Usage

### Start the Server
```bash
npm start
```

The server will run on `http://localhost:5000`

### Start the Frontend
```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000`

### Run Tests
```bash
npm test
```

---

## 🏗️ Architecture

```
yaqeen/
├── backend/
│   ├── server.js                 # Main server
│   ├── database.js               # Database management
│   ├── routes/
│   │   ├── analysis.js          # Analysis routes
│   │   ├── report.js            # Report routes
│   │   └── health.js            # Health check
│   └── services/
│       ├── forensics.js         # Forensic services
│       ├── deepfake-detector.js # Deepfake detection
│       └── report-generator.js  # Report generation
├── frontend/
│   └── public/
│       ├── index.html           # Main page
│       ├── styles.css           # Styling
│       └── app.js               # Application
├── assets/
│   └── logo.png                 # Application logo
├── tests/
│   └── analysis.test.js         # Unit tests
├── package.json                 # Project information
├── .env                         # Environment variables
└── README.md                    # This file
```

### Data Flow

```
1. User uploads file
   ↓
2. Server receives and saves file
   ↓
3. Calculate original file hash
   ↓
4. Analyze metadata
   ↓
5. Detect deepfakes and AI-generated content
   ↓
6. Calculate authenticity score
   ↓
7. Display results and recommendations
   ↓
8. Generate report (optional)
```

---

## 🔐 Forensic Documentation

**Yaqeen** is designed with full compliance to digital forensics principles:

### Read-Only
- Original files are not modified during analysis
- All analyses are performed on temporary copies

### Hash Calculation
- **SHA-256** calculation for original files
- Hash logging before and after processing
- Ensuring file integrity

### Chain of Custody
- Comprehensive logging of all steps
- Precise timing for each operation
- Complete file tracking from upload to report

---

## 🧪 Testing

A comprehensive test suite ensures reliability:

```bash
# Run all tests
npm test

# Run specific tests
npm test -- tests/analysis.test.js
```

### Included Tests
- ✅ Authenticity score calculation
- ✅ Metadata anomaly detection
- ✅ File type validation
- ✅ File size validation
- ✅ File size formatting
- ✅ Deepfake probability calculation

---

## 📊 Example Response

```json
{
  "status": "success",
  "message": "File analyzed successfully",
  "data": {
    "fileName": "image.jpg",
    "fileSize": 2048576,
    "mimeType": "image/jpeg",
    "fileHash": "abc123def456...",
    "authenticityScore": 85,
    "results": {
      "metadata": {
        "format": "jpeg",
        "width": 1920,
        "height": 1080,
        "anomalies": []
      },
      "deepfake": {
        "probability": 0.15,
        "isDeepfake": false,
        "isAIGenerated": false
      }
    }
  }
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a branch for the new feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Hassan Mohamed Hassan Ahmed**

- GitHub: [@kush-king249](https://github.com/kush-king249)
- Email: hassan@example.com

### About the Project

**Yaqeen** was developed as a revolutionary project in the field of digital forensics and media authenticity verification. The project combines complex software engineering skills with expertise in artificial intelligence and deep understanding of forensic concepts.

---

## 📞 Support and Contact

For questions and support:
- 📧 Email: support@yaqeen.io
- 🐛 Report Bugs: [GitHub Issues](https://github.com/kush-king249/yaqeen/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/kush-king249/yaqeen/discussions)

---

## 🙏 Acknowledgments

Special thanks to all contributors and testers who helped develop this project.

---

**Last Updated**: October 2024
**Version**: 1.0.0

