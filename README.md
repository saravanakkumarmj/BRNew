# Blood report analysis

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/saravanakkumarmj-1851s-projects/v0-blood-report-analysis)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Og2rdjUNl3s)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Blood Report Analyzer

An AI-powered blood report analysis tool that uses Langflow to analyze blood test PDFs and provide health insights and product recommendations.

## 🚀 Quick Start

### Access the Application
- **Local**: http://localhost:3000
- **Deployed**: https://vercel.com/saravanakkumarmj-1851s-projects/v0-blood-report-analysis

## 🎯 How to Use

1. **Fill in your information**: Enter your name, age, and gender
2. **Upload a PDF**: Upload a PDF blood test report
3. **Get Analysis**: Click "Analyze Report" to get AI-powered analysis from Langflow
4. **View Results**: See detailed blood test results, recommendations, and product suggestions

## 🔧 Configuration

### Required Environment Variables

**In v0:** Add these environment variables in the **Vars** section of the in-chat sidebar:
\`\`\`
LANGFLOW_URL=http://localhost:7860
LANGFLOW_FLOW_ID=your-flow-id
LANGFLOW_API_KEY=your-api-key
NEXT_PUBLIC_LANGFLOW_FLOW_ID=your-flow-id
\`\`\`

**For local development:** Copy `.env.example` to `.env.local` and configure the same variables.

See [docs/LANGFLOW_SETUP.md](docs/LANGFLOW_SETUP.md) for detailed setup instructions.

## ✨ Features

- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **AI Analysis**: Real-time blood test analysis using Langflow
- **Product Recommendations**: Suggested supplements based on results
- **Interactive Chat**: Conversational interface for user interaction
- **File Upload**: PDF blood report upload functionality
- **Secure Proxy**: API key kept secure on server side

## 📁 Project Structure

- `app/` - Next.js app directory
- `components/` - React components
- `components/ui/` - Reusable UI components
- `app/api/` - API routes for Langflow integration
- `docs/` - Documentation files
- `.env.local` - Environment configuration

## 🛠️ Development

### Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔍 Fixed Issues

- ✅ **Duplicate Key Errors**: Fixed React key conflicts in chat interface
- ✅ **Environment Configuration**: Proper Langflow integration setup
- ✅ **Error Handling**: Improved error messages and user experience
- ✅ **CORS Issues**: Implemented secure proxy pattern
- ✅ **Response Parsing**: Enhanced parsing with multiple fallback strategies

## Deployment

Your project is live at:

**[https://vercel.com/saravanakkumarmj-1851s-projects/v0-blood-report-analysis](https://vercel.com/saravanakkumarmj-1851s-projects/v0-blood-report-analysis)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/Og2rdjUNl3s](https://v0.app/chat/projects/Og2rdjUNl3s)**

---

**Note**: This application requires a configured Langflow instance for blood report analysis. See the configuration section above for setup instructions.
