# Langflow API Setup Guide

## 🚀 Real API Configuration

Your application is now configured to use the **real Langflow API** instead of mock data.

### ✅ Current Configuration
- **Flow ID**: `76e6bbab-83bc-4ea6-82e0-85b4fef653b9`
- **Server URL**: `http://localhost:7860`
- **Mock Analysis**: Disabled
- **Status**: Ready for real API calls

## 🔧 Prerequisites

### 1. Langflow Server Setup
Make sure you have a Langflow instance running:

\`\`\`bash
# Install Langflow (if not already installed)
pip install langflow

# Start Langflow server
langflow run --host 0.0.0.0 --port 7860
\`\`\`

### 2. Verify Langflow is Running
Check if your Langflow server is accessible:
\`\`\`bash
curl http://localhost:7860/api/v1/flows
\`\`\`

### 3. Flow Configuration
Ensure your Langflow flow with ID `76e6bbab-83bc-4ea6-82e0-85b4fef653b9` is:
- ✅ **Published** (not in draft mode)
- ✅ **Configured** to accept file uploads
- ✅ **Set up** for blood report analysis

## 🧪 Testing the Integration

### 1. Start Your Application
\`\`\`bash
npm run dev
\`\`\`
**Access**: http://localhost:3000

### 2. Test the Flow
1. Fill in user information (name, age, gender)
2. Upload a PDF blood test report
3. Click "Analyze Report"
4. The app will now call your real Langflow flow

### 3. Monitor API Calls
Check the terminal for API call logs:
\`\`\`
[v0] Proxy: Received request
[v0] Proxy: Uploading file to Langflow...
[v0] Proxy: Running analysis...
\`\`\`

## 🔍 Troubleshooting

### If you get "Flow ID is required" error:
- Verify your Flow ID is correct in `.env.local`
- Ensure the flow is published in Langflow

### If you get connection errors:
- Check if Langflow server is running on port 7860
- Verify the LANGFLOW_URL in `.env.local`

### If analysis fails:
- Check your Langflow flow configuration
- Ensure the flow accepts the expected input format
- Verify file upload settings in your flow

## 📊 Expected Flow Behavior

Your Langflow flow should:
1. **Accept**: PDF file uploads
2. **Process**: Blood test data extraction
3. **Return**: Analysis results in the expected format:
   \`\`\`json
   {
     "outputs": [
       {
         "outputs": [
           {
             "results": {
               "message": {
                 "text": "Your analysis results here..."
               }
             }
           }
         ]
       }
     ]
   }
   \`\`\`

## 🔄 Switching Back to Mock Data

If you need to temporarily use mock data:
\`\`\`bash
# Edit .env.local
NEXT_PUBLIC_USE_MOCK_ANALYSIS=true
\`\`\`

## 📝 API Endpoints Used

Your application makes these API calls to Langflow:

1. **File Upload**: `POST /api/v1/upload/{flow_id}`
2. **Run Analysis**: `POST /api/v1/run/{flow_id}`

## 🎯 Next Steps

1. **Ensure Langflow is running** on localhost:7860
2. **Verify your flow is published** and configured correctly
3. **Test the application** with a real PDF blood report
4. **Monitor the logs** for any API errors

---

**Your blood report analyzer is now ready to use real AI analysis! 🩸🤖**
