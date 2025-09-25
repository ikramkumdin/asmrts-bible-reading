# GCP Audio Setup Guide

This guide explains how to set up Google Cloud Storage for hosting audio files.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account
2. **Google Cloud SDK**: Install the Google Cloud SDK
3. **GCP Project**: Create or select a GCP project

## Step 1: Install Google Cloud SDK

### macOS (using Homebrew)
```bash
brew install google-cloud-sdk
```

### Other platforms
Visit: https://cloud.google.com/sdk/docs/install

## Step 2: Authenticate with Google Cloud

```bash
gcloud auth login
```

## Step 3: Set your project

```bash
gcloud config set project YOUR_PROJECT_ID
```

## Step 4: Create the bucket

```bash
gsutil mb gs://bible-audio-files-asmrts
```

## Step 5: Make bucket publicly readable

```bash
gsutil iam ch allUsers:objectViewer gs://bible-audio-files-asmrts
```

## Step 6: Upload audio files

```bash
npm run upload-audio
```

## Step 7: Verify upload

Visit: https://storage.googleapis.com/bible-audio-files-asmrts/audio/

You should see your audio files organized by preset and book.

## Configuration

The app is configured to:
- **Development**: Use local audio files from `public/audio/`
- **Production**: Use GCP bucket at `https://storage.googleapis.com/bible-audio-files-asmrts/audio/`

## File Structure in Bucket

```
bible-audio-files-asmrts/
└── audio/
    ├── luna/
    │   └── genesis/
    │       ├── chapter1/
    │       │   ├── chapter1.mp3
    │       │   ├── 1.mp3
    │       │   ├── 2.mp3
    │       │   └── ...
    │       └── chapter2/
    │           └── ...
    ├── river/
    ├── aria/
    └── heartsease/
```

## Troubleshooting

### Authentication Issues
```bash
gcloud auth application-default login
```

### Permission Issues
Make sure the bucket is publicly readable:
```bash
gsutil iam ch allUsers:objectViewer gs://bible-audio-files-asmrts
```

### Upload Issues
Check if the bucket exists:
```bash
gsutil ls gs://bible-audio-files-asmrts
```

## Cost Considerations

- **Storage**: ~$0.020 per GB per month
- **Bandwidth**: ~$0.12 per GB for downloads
- **Operations**: ~$0.05 per 10,000 operations

For 1GB of audio files, expect ~$0.02/month storage + bandwidth costs based on usage.
