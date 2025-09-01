# Audio Generation System - ASMRTS Bible

This document describes the comprehensive audio generation system implemented in the ASMRTS Bible project, designed to convert text content into high-quality audio using advanced TTS (Text-to-Speech) technology.

## 🎯 Overview

The audio generation system provides a complete pipeline for:
- Converting text to speech using multiple TTS providers
- Processing various file formats (TXT, PDF, DOCX, HTML, JSON, XML)
- Batch processing for large-scale audio generation
- Quality checking and validation
- Cloud storage integration (Google Cloud Platform)
- Web-based UI for easy interaction

## 🏗️ Architecture

### Core Components

1. **API Routes** (`/src/app/api/audio/`)
   - `/generate` - Single text-to-audio conversion
   - `/upload` - File upload and processing
   - `/batch` - Batch processing multiple items

2. **Core Libraries** (`/src/lib/`)
   - `audioProcessor.ts` - Main audio generation logic
   - `fileProcessor.ts` - File handling and text extraction
   - `batchProcessor.ts` - Batch processing with queue management
   - `validators.ts` - Input validation and sanitization

3. **TTS Providers** (`/src/lib/providers/`)
   - `elevenlabs.ts` - ElevenLabs API integration
   - `openai.ts` - OpenAI TTS API integration

4. **Storage & Quality** (`/src/lib/`)
   - `storage/gcp.ts` - Google Cloud Platform storage
   - `quality/qualityChecker.ts` - Audio quality validation

5. **UI Components** (`/src/components/`)
   - `AudioGenerator.tsx` - Main audio generation interface

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `env.example` to `.env.local` and configure:

```bash
# Required: ElevenLabs API Key
ELEVENLABS_API_KEY=your_api_key_here

# Required: Google Cloud Platform
GCP_PROJECT_ID=your_project_id
GCP_BUCKET_NAME=your_bucket_name
GCP_CREDENTIALS={"type":"service_account",...}

# Optional: OpenAI API (alternative TTS provider)
OPENAI_API_KEY=your_openai_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Test Audio Generation

```bash
npm run generate-audio
```

## 📖 Usage

### Web Interface

1. Navigate to the audio generator page
2. Choose input method: Text, File Upload, or Batch Processing
3. Select voice model (Luna, River, Aria, Heartsease)
4. Choose audio format (MP3, WAV, M4A)
5. Set quality level (Standard, High, Ultra)
6. Generate audio

### API Endpoints

#### Generate Audio from Text

```bash
POST /api/audio/generate
Content-Type: application/json

{
  "text": "Your text here",
  "voice": "luna",
  "format": "mp3",
  "quality": "standard"
}
```

#### Upload File for Processing

```bash
POST /api/audio/upload
Content-Type: multipart/form-data

file: [your_file]
voice: "luna"
format: "mp3"
quality: "standard"
```

#### Batch Processing

```bash
POST /api/audio/batch
Content-Type: application/json

{
  "items": [
    {"id": "1", "text": "First item", "voice": "luna", "format": "mp3", "quality": "standard", "priority": "medium"},
    {"id": "2", "text": "Second item", "voice": "luna", "format": "mp3", "quality": "standard", "priority": "medium"}
  ],
  "voice": "luna",
  "format": "mp3",
  "quality": "standard",
  "batchSize": 10
}
```

## 🎵 Voice Models

| Voice | Description | Best For |
|-------|-------------|----------|
| **Luna** | Soft, calming voice | Meditation, relaxation |
| **River** | Smooth, flowing voice | Storytelling, narration |
| **Aria** | Clear, melodic voice | Educational content |
| **Heartsease** | Warm, comforting voice | Spiritual content |

## 📁 Supported File Formats

- **Text**: `.txt` - Plain text files
- **Documents**: `.pdf`, `.docx` - Document files
- **Web**: `.html`, `.htm` - HTML files
- **Data**: `.json`, `.xml` - Structured data files

## 🔧 Configuration Options

### Quality Settings

- **Standard**: Fast generation, good quality
- **High**: Better quality, moderate generation time
- **Ultra**: Best quality, longer generation time

### Audio Formats

- **MP3**: Good quality, small file size
- **WAV**: High quality, larger file size
- **M4A**: High quality, optimized for mobile

### Batch Processing

- **Max Batch Size**: 50 items
- **Concurrent Processing**: Configurable
- **Progress Tracking**: Real-time updates
- **Error Handling**: Graceful failure management

## 🧪 Testing

### Local Testing

```bash
# Test audio generation with sample verses
npm run generate-audio

# Test file upload functionality
npm run test-file-upload

# Test batch processing
npm run test-batch
```

### Quality Testing

The system includes automated quality checks:
- Audio file validation
- Speech recognition accuracy
- File size and duration verification
- Format compatibility testing

## 📊 Monitoring & Analytics

### Generation Metrics

- Success/failure rates
- Processing times
- Quality scores
- Storage usage
- API rate limits

### Error Tracking

- Detailed error logging
- Failure categorization
- Retry mechanisms
- User feedback

## 🔒 Security & Validation

### Input Validation

- Text length limits
- File size restrictions
- Format validation
- Content sanitization

### API Security

- Rate limiting
- Input sanitization
- Error message filtering
- Authentication (future)

## 🚧 Future Enhancements

### Planned Features

1. **Advanced TTS Providers**
   - Azure Speech Services
   - AWS Polly
   - Google Cloud TTS

2. **Enhanced Quality Control**
   - Real-time speech recognition
   - Audio enhancement algorithms
   - Custom voice training

3. **Content Management**
   - Audio library organization
   - Playlist creation
   - Sharing and collaboration

4. **Analytics Dashboard**
   - Usage statistics
   - Quality metrics
   - Performance monitoring

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify environment variables
   - Check API key permissions
   - Ensure proper formatting

2. **File Upload Failures**
   - Check file size limits
   - Verify supported formats
   - Ensure proper encoding

3. **Generation Failures**
   - Check text length limits
   - Verify voice availability
   - Monitor API rate limits

### Debug Mode

Enable detailed logging:

```bash
LOG_LEVEL=debug npm run dev
```

## 📚 API Reference

### Complete API Documentation

See individual API route files for detailed specifications:
- `/src/app/api/audio/generate/route.ts`
- `/src/app/api/audio/upload/route.ts`
- `/src/app/api/audio/batch/route.ts`

### Type Definitions

All TypeScript interfaces are defined in:
- `/src/lib/types.ts`

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Comprehensive error handling

## 📄 License

This project is part of the ASMRTS Bible application. See main project license for details.

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section
- Review API documentation
- Examine error logs
- Contact development team

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Active Development
