# ASMR Bible Reading App - Deployment Guide

## 🚀 Deployment Overview

This Next.js application is ready for deployment with the following features:
- ✅ **Build Success**: All TypeScript and ESLint errors fixed
- ✅ **Authentication**: Firebase Google Sign-In integration
- ✅ **Voices Page**: Fully functional with audio previews
- ✅ **Bible Study**: Complete with audio playback and progress tracking
- ✅ **Responsive Design**: Mobile and desktop optimized

## 🔧 Environment Variables Setup

### Required for Production Deployment:

1. **Firebase Configuration** (Required for Authentication):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id
   ```

2. **Backend API Configuration**:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://asmrtts-website.vercel.app
   ```

## 🌐 Deployment Platforms

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Self-Hosted
1. Run `npm run build`
2. Run `npm start`
3. Configure reverse proxy (nginx/Apache)

## 🔐 Authentication Setup

### Firebase Project Configuration:
1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Authentication → Google Sign-In

2. **Configure Authentication**:
   - Add your domain to authorized domains
   - Enable Google provider
   - Set up Firestore database

3. **Get Configuration**:
   - Go to Project Settings → General
   - Copy configuration values to environment variables

## 🎵 Audio Integration

### Backend Integration:
- **Production URL**: `https://asmrtts-website.vercel.app`
- **Local Development**: `http://localhost:8000`
- Audio files are served from `/public/audio/` directory
- Preset images from `/public/presets/` directory

### Audio File Structure:
```
public/
├── audio/
│   ├── luna/genesis/chapter1/
│   ├── river/genesis/chapter1/
│   ├── aria/genesis/chapter1/
│   └── heartsease/genesis/chapter1/
└── presets/
    ├── Preset1.jpg
    ├── Preset2.jpg
    ├── Preset3.jpg
    └── Preset4.jpg
```

## 🚀 Quick Deployment Steps

### 1. Environment Setup:
```bash
# Copy environment template
cp env.example .env.local

# Edit with your values
nano .env.local
```

### 2. Build and Test:
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally
npm start
```

### 3. Deploy to Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔍 Post-Deployment Checklist

- [ ] Authentication works (Google Sign-In)
- [ ] Voices page loads with preset images
- [ ] Audio previews work correctly
- [ ] Bible study page functions properly
- [ ] Mobile responsiveness works
- [ ] All routes are accessible
- [ ] Environment variables are set correctly

## 🐛 Troubleshooting

### Common Issues:

1. **Authentication Not Working**:
   - Check Firebase configuration
   - Verify domain is authorized in Firebase
   - Check environment variables

2. **Audio Not Playing**:
   - Verify audio files exist in `/public/audio/`
   - Check browser console for errors
   - Ensure backend URL is correct

3. **Build Failures**:
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all dependencies are installed

## 📱 Features Included

### ✅ Completed Features:
- **Authentication**: Google Sign-In with Firebase
- **Voices Selection**: 4 preset voices with previews
- **Bible Study**: Genesis chapters with audio playback
- **Progress Tracking**: Chapter completion status
- **Responsive Design**: Mobile and desktop optimized
- **Audio Controls**: Play/pause, progress tracking
- **State Management**: LocalStorage persistence

### 🎯 Ready for Production:
- Build successful with no errors
- All TypeScript issues resolved
- ESLint warnings addressed
- Mobile-friendly design
- Authentication integrated
- Audio functionality working

## 🔗 Important URLs

- **Production Backend**: `https://asmrtts-website.vercel.app`
- **Local Development**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000` (development)

## 📞 Support

For deployment issues:
1. Check environment variables
2. Verify Firebase configuration
3. Test build locally first
4. Check browser console for errors
