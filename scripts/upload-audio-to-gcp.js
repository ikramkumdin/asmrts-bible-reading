#!/usr/bin/env node

/**
 * Script to upload audio files to GCP bucket
 * 
 * Prerequisites:
 * 1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
 * 2. Authenticate: gcloud auth login
 * 3. Set project: gcloud config set project YOUR_PROJECT_ID
 * 4. Install dependencies: npm install @google-cloud/storage
 */

const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// Configuration
const BUCKET_NAME = 'asmrts-bible-audio-files';
const AUDIO_DIR = path.join(__dirname, '../public/audio');
const DESTINATION_PREFIX = 'audio/';

// Initialize Google Cloud Storage
const storage = new Storage();

async function uploadAudioFiles() {
  try {
    console.log('🚀 Starting audio upload to GCP bucket...');
    console.log(`📁 Source directory: ${AUDIO_DIR}`);
    console.log(`🪣 Bucket: ${BUCKET_NAME}`);
    console.log(`📂 Destination prefix: ${DESTINATION_PREFIX}`);
    
    // Check if audio directory exists
    if (!fs.existsSync(AUDIO_DIR)) {
      throw new Error(`Audio directory not found: ${AUDIO_DIR}`);
    }
    
    // Get bucket reference
    const bucket = storage.bucket(BUCKET_NAME);
    
    // Check if bucket exists
    const [exists] = await bucket.exists();
    if (!exists) {
      throw new Error(`Bucket ${BUCKET_NAME} does not exist. Please create it first.`);
    }
    
    // Upload all audio files recursively
    await uploadDirectory(AUDIO_DIR, bucket, DESTINATION_PREFIX);
    
    console.log('✅ Audio upload completed successfully!');
    console.log(`🌐 Files are now available at: https://storage.googleapis.com/${BUCKET_NAME}/${DESTINATION_PREFIX}`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    process.exit(1);
  }
}

async function uploadDirectory(dirPath, bucket, prefix) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively upload subdirectories
      await uploadDirectory(itemPath, bucket, `${prefix}${item}/`);
    } else if (item.endsWith('.mp3')) {
      // Upload MP3 files
      const fileName = path.relative(AUDIO_DIR, itemPath);
      const destinationName = `${prefix}${fileName}`;
      
      console.log(`📤 Uploading: ${fileName} -> ${destinationName}`);
      
      await bucket.upload(itemPath, {
        destination: destinationName,
        metadata: {
          cacheControl: 'public, max-age=31536000', // Cache for 1 year
          contentType: 'audio/mpeg'
        }
      });
      
      console.log(`✅ Uploaded: ${fileName}`);
    }
  }
}

// Run the upload
if (require.main === module) {
  uploadAudioFiles();
}

module.exports = { uploadAudioFiles };
