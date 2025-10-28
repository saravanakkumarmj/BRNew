# 🔑 Get Your Langflow API Key

## Quick Steps:

### 1. Open Langflow Dashboard
- Go to: http://localhost:7860
- Login to your Langflow account

### 2. Generate API Key
- Click on your **profile icon** (top-right corner)
- Select **"Settings"**
- Go to **"Langflow API Keys"**
- Click **"Add New"**
- Enter a name: `Blood Report Analyzer`
- Click **"Create API Key"**
- **Copy the generated key** (save it somewhere safe!)

### 3. Update Configuration
Replace `your-api-key-here` in `.env.local` with your actual API key:

\`\`\`bash
# Edit the file manually or run:
sed -i '' 's/LANGFLOW_API_KEY=your-api-key-here/LANGFLOW_API_KEY=YOUR_ACTUAL_API_KEY_HERE/' .env.local
\`\`\`

### 4. Restart Server
\`\`\`bash
pkill -f "next dev"
npm run dev
\`\`\`

## 🔍 Alternative: Check Langflow Settings

If you can't find the API key section, your Langflow instance might be configured differently. Check:

1. **Langflow version** - newer versions have different UI
2. **Authentication settings** - some instances don't require API keys
3. **Admin panel** - API keys might be in a different location

## ✅ Test After Update

Once you've updated the API key, test the application:
1. Go to http://localhost:3000
2. Fill in user info
3. Upload a PDF
4. Click "Analyze Report"
5. Check terminal for successful API calls

---

**Your API key should look something like:** `lf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
