# 🚀 Startup Guide - ASMRTS Bible

This guide will help you get both the frontend and backend running for the ASMRTS Bible audio generation system.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to the `asmrtts_website` backend

## 🔧 Step 1: Start the Backend

First, you need to start the `asmrtts_website` backend server:

```bash
# Navigate to the backend directory
cd asmrtts_website

# Install dependencies (if not already done)
npm install

# Start the backend server
npm start
```

The backend should start on `http://localhost:8000`

**Expected output:**
```
Server running on port 8000
🚀 Queue processor started
```

## 🎨 Step 2: Start the Frontend

In a new terminal window, start the frontend:

```bash
# Navigate to the frontend directory
cd asmrts-bible

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend should start on `http://localhost:3000`

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

## ✅ Step 3: Verify Connection

1. Open your browser and go to `http://localhost:3000`
2. You should see the ASMRTS Bible homepage
3. Scroll down to the "Audio Generator" section
4. Check that the backend status shows "✅ Backend connected"

## 🎵 Step 4: Test Audio Generation

1. Enter some Bible text in the text area
2. Select a voice model (Luna, River, Aria, or Heartsease)
3. Click "Generate Audio"
4. Wait for the generation to complete
5. Play the generated audio or download it

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
**Solution**: 
- Check if port 8000 is already in use
- Verify all environment variables are set in `asmrtts_website/.env`
- Check the backend logs for specific errors

**Problem**: Backend starts but frontend can't connect
**Solution**:
- Verify the backend is running on `http://localhost:8000`
- Check if CORS is properly configured
- Try accessing `http://localhost:8000/api/audio/list` directly

### Frontend Issues

**Problem**: Frontend shows "Backend not available"
**Solution**:
- Make sure the backend is running
- Check the browser console for network errors
- Verify the backend URL in the frontend code

**Problem**: Audio generation fails
**Solution**:
- Check the backend logs for detailed error messages
- Verify the text length is reasonable
- Ensure the backend has proper API keys configured

## 🔄 Development Workflow

### Making Changes

1. **Frontend Changes**: Edit files in `asmrts-bible/src/`
2. **Backend Changes**: Edit files in `asmrtts_website/`
3. **Hot Reload**: Both servers support hot reloading

### Testing

1. **Frontend**: Changes are automatically reflected in the browser
2. **Backend**: Restart the server if you modify server.js or routes
3. **API Testing**: Use the browser's Network tab to monitor API calls

## 📁 Project Structure

```
Meditation app/
├── asmrts-bible/          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # Pages
│   │   ├── components/    # React components
│   │   └── lib/          # Utilities
│   └── package.json
└── asmrtts_website/       # Backend (Express.js)
    ├── routes/            # API routes
    ├── utils/             # Utilities
    ├── server.js          # Main server file
    └── package.json
```

## 🎯 Next Steps

Once both servers are running:

1. **Explore the UI**: Try different voice models and text inputs
2. **Test Features**: Generate audio, download files, check the queue
3. **Customize**: Modify the voice presets or add new features
4. **Deploy**: When ready, deploy both frontend and backend

## 📞 Support

If you encounter issues:

1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify all environment variables are set correctly
4. Ensure both servers are running on the correct ports

---

**Happy Audio Generating! 🎵**
