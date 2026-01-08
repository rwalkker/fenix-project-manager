# 🚀 FENIX Project Manager

**AI-powered document generation platform with file upload capabilities**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## ✨ Features

- 🤖 **AI-Powered Generation** - Create PowerPoint, Excel, and Word documents using AWS Bedrock
- 📎 **File Upload Support** - Drag & drop files for AI analysis and integration
- 🎨 **Dynamic Theming** - Intelligent theme selection based on content
- 👥 **Role-Based Access** - Admin, Power User, User, and Viewer roles
- 🔒 **Secure Authentication** - JWT-based authentication with public access option
- 📊 **Real-time Progress** - WebSocket-based progress tracking
- 🌐 **Production Ready** - Deployed on Render.com with enterprise security

---

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Render
1. Fork this repository
2. Connect to Render.com
3. Set environment variables (see below)
4. Deploy automatically

---

## 🔧 Environment Variables

Required environment variables for deployment:

```env
# AWS Credentials (for Bedrock AI)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Security
JWT_SECRET=your_jwt_secret_32_chars_minimum
SESSION_SECRET=your_session_secret_32_chars_minimum

# Application
NODE_ENV=production
PORT=10000
LOG_LEVEL=info

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/tmp/uploads
STORAGE_PATH=/tmp/fenix-storage
```

---

## 📋 Supported File Types

**Upload Support:**
- 📄 PDF documents
- 📝 Word documents (.docx)
- 📊 Excel spreadsheets (.xlsx)
- 📋 PowerPoint presentations (.pptx)
- 📄 Text files (.txt)
- 📊 CSV files (.csv)
- 🔧 JSON files (.json)
- 📝 Markdown files (.md)

**Generation Support:**
- 📊 PowerPoint presentations with AI theming
- 📈 Excel workbooks with data analysis
- 📝 Word documents with formatting
- 🔄 Process improvement tools (flowcharts, fishbone diagrams)

---

## 🏗️ Architecture

```
FENIX Project Manager
├── Frontend (Vanilla JS SPA)
│   ├── File upload with drag & drop
│   ├── Document generation interface
│   └── Real-time progress tracking
├── Backend (Node.js + TypeScript)
│   ├── Express.js API server
│   ├── JWT authentication
│   ├── File processing service
│   └── AI integration (AWS Bedrock)
└── AI Agents
    ├── PowerPoint Agent (PptxGenJS)
    ├── Excel Agent (ExcelJS)
    └── Word Agent (Docx)
```

---

## 🔒 Security Features

- ✅ **HTTPS Encryption** - All traffic encrypted
- ✅ **File Type Validation** - Only allowed file types accepted
- ✅ **File Size Limits** - 10MB maximum upload size
- ✅ **Role-Based Access Control** - Granular permissions
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Environment Variable Security** - Secrets stored securely
- ✅ **Input Validation** - All inputs sanitized
- ✅ **CORS Protection** - Cross-origin request protection

---

## 📊 Performance

- ⚡ **Fast Generation** - Documents created in seconds
- 🌐 **Global CDN** - Fast worldwide access via Render
- 📈 **Auto-scaling** - Handles traffic spikes automatically
- 💾 **Efficient Storage** - Optimized file handling
- 🔄 **Real-time Updates** - WebSocket progress tracking

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- TypeScript
- AWS Account (for Bedrock access)

### Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Configure AWS credentials
5. Start development: `npm run dev`

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Test specific features
npm run test:ai
npm run test:upload
```

---

## 📚 API Documentation

### Authentication
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user (public access)
- `POST /api/v1/auth/logout` - User logout

### Document Generation
- `POST /api/v1/generate/powerpoint` - Generate PowerPoint
- `POST /api/v1/generate/excel` - Generate Excel workbook
- `POST /api/v1/generate/word` - Generate Word document
- `GET /api/v1/generate/status/:id` - Check generation status
- `GET /api/v1/generate/download/:id` - Download generated document

### File Upload
- `POST /api/v1/generate/upload` - Upload file for AI analysis
- `GET /api/v1/generate/uploads` - List uploaded files
- `DELETE /api/v1/generate/upload/:id` - Delete uploaded file

---

## 🚀 Deployment

### Render.com (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically
4. Custom domain support

### Other Platforms
- Railway.app
- Fly.io
- Heroku
- AWS ECS
- Docker deployment

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

---

## 📞 Support

- 📧 Email: support@fenix-pm.com
- 📚 Documentation: [Full deployment guide](RENDER_DEPLOYMENT_GUIDE.md)
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

## 🎯 Roadmap

- [ ] Database integration (PostgreSQL)
- [ ] Advanced AI models
- [ ] Template marketplace
- [ ] Collaboration features
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced analytics

---

**Built with ❤️ for operations teams who need powerful document generation tools.**