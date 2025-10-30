#!/usr/bin/env node

/**
 * Script to upload preset greeting audio files to GCP bucket
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
const PRESETS_DIR = path.join(__dirname, '../public/presets');
const DESTINATION_PREFIX = 'presets/';

// Initialize Google Cloud Storage
const storage = new Storage();

async function uploadPresetFiles() {
  try {
    console.log('🚀 Starting preset files upload to GCP bucket...');
    console.log(`📁 Source directory: ${PRESETS_DIR}`);
    console.log(`🪣 Bucket: ${BUCKET_NAME}`);
    console.log(`📂 Destination prefix: ${DESTINATION_PREFIX}`);
    
    // Check if presets directory exists
    if (!fs.existsSync(PRESETS_DIR)) {
      throw new Error(`Presets directory not found: ${PRESETS_DIR}`);
    }
    
    // Get bucket reference
    const bucket = storage.bucket(BUCKET_NAME);
    
    // Check if bucket exists
    const [exists] = await bucket.exists();
    if (!exists) {
      throw new Error(`Bucket ${BUCKET_NAME} does not exist. Please create it first.`);
    }
    
    // Upload Preset3 and Preset4 greeting files
    const presetFiles = ['Preset3_Greeting.mp3', 'Preset4_Greeting.mp3'];
    
    for (const fileName of presetFiles) {
      const filePath = path.join(PRESETS_DIR, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${filePath}, skipping...`);
        continue;
      }
      
      const destinationName = `${DESTINATION_PREFIX}${fileName}`;
      
      console.log(`📤 Uploading: ${fileName} -> ${destinationName}`);
      
      try {
        await bucket.upload(filePath, {
          destination: destinationName,
          metadata: {
            cacheControl: 'public, max-age=31536000', // Cache for 1 year
            contentType: 'audio/mpeg'
          }
        });
        
        console.log(`✅ Uploaded: ${fileName}`);
      } catch (uploadError) {
        console.error(`❌ Failed to upload ${fileName}:`, uploadError.message);
      }
    }
    
    console.log('✅ Preset files upload completed!');
    console.log(`🌐 Files are now available at: https://storage.googleapis.com/${BUCKET_NAME}/${DESTINATION_PREFIX}`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    process.exit(1);
  }
}

// Run the upload
if (require.main === module) {
  uploadPresetFiles();
}

module.exports = { uploadPresetFiles };
