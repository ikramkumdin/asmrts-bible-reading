# ASMRTS Bible - Audio Generation Frontend

A beautiful frontend for generating Bible audio content using the existing ASMRTS backend infrastructure.

## 🎯 Overview

This project provides a modern, user-friendly interface for converting Bible text into high-quality audio using the existing `asmrtts_website` backend. It leverages the proven audio generation infrastructure while providing a clean, focused UI for Bible content.

## 🚀 Quick Start

### Prerequisites

1. **Backend Server**: Make sure the `asmrtts_website` backend is running on port 8000
2. **Node.js**: Version 18 or higher

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎵 Features

- **Text-to-Speech**: Convert Bible text to audio using multiple voice models
- **Voice Selection**: Choose from Luna, River, Aria, and Heartsease voices
- **Real-time Generation**: Instant audio generation with progress indicators
- **Audio Playback**: Built-in audio player with download functionality
- **Backend Integration**: Seamless connection to existing ASMRTS infrastructure
- **Responsive Design**: Works on desktop and mobile devices

## 🎨 Voice Models

| Voice | Description | Best For |
|-------|-------------|----------|
| **Luna** | Soft, calming voice | Meditation, relaxation |
| **River** | Smooth, flowing voice | Storytelling, narration |
| **Aria** | Clear, melodic voice | Educational content |
| **Heartsease** | Warm, comforting voice | Spiritual content |

## 🔧 Configuration

The frontend automatically connects to the backend at `http://localhost:8000`. You can customize this by setting the `NEXT_PUBLIC_BACKEND_URL` environment variable.

## 📖 Usage

1. **Enter Text**: Paste or type your Bible text in the text area
2. **Choose Voice**: Select your preferred voice model
3. **Generate**: Click "Generate Audio" to create your audio
4. **Play & Download**: Use the built-in player or download the audio file

## 🏗️ Architecture

### Frontend (asmrts-bible)
- **Next.js 15**: Modern React framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API communication

### Backend (asmrtts_website)
- **Express.js**: Node.js web framework
- **Firebase**: Authentication and storage
- **TTS API**: Text-to-speech generation
- **Queue System**: Background processing

## 🔗 API Integration

The frontend communicates with the backend using these endpoints:

- `POST /api/audio/generate` - Generate audio immediately
- `POST /api/audio/generate-queued` - Add to generation queue
- `GET /api/audio/list` - List user's audio files
- `GET /api/audio/:filePath` - Download audio file

## 🚧 Development

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx         # Main page
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── AudioGenerator.tsx
│   ├── BibleBookCard.tsx
│   ├── Header.tsx
│   └── Footer.tsx
└── lib/                 # Utility libraries
    └── audioService.ts  # Backend API integration
```

### Adding New Features

1. **New Voice Models**: Update `VOICE_PRESETS` in `audioService.ts`
2. **UI Components**: Add new components in `components/`
3. **API Integration**: Extend `audioService.ts` with new endpoints

## 🐛 Troubleshooting

### Backend Connection Issues

If you see "Backend not available":
1. Ensure `asmrtts_website` is running on port 8000
2. Check firewall settings
3. Verify backend health endpoint

### Audio Generation Failures

1. Check backend logs for detailed error messages
2. Verify text length (should be reasonable)
3. Ensure backend has proper API keys configured

## 📄 License

This project is part of the ASMRTS Bible application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Status**: Active Development  
**Version**: 1.0.0  
**Last Updated**: December 2024
