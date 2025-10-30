#!/bin/bash

# Script to configure CORS for the GCP bucket
# This allows the browser to load audio files from the bucket

BUCKET_NAME="asmrts-bible-audio-files"

echo "🔧 Setting up CORS for bucket: gs://${BUCKET_NAME}"

# Create a temporary CORS configuration file
cat > /tmp/cors-config.json << 'EOF'
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "responseHeader": ["Content-Type", "Content-Length", "Accept-Ranges", "Content-Range"],
    "maxAgeSeconds": 3600
  }
]
EOF

echo "📝 CORS configuration:"
cat /tmp/cors-config.json

echo ""
echo "🚀 Applying CORS configuration to bucket..."
gsutil cors set /tmp/cors-config.json gs://${BUCKET_NAME}

echo ""
echo "✅ Verifying CORS configuration..."
gsutil cors get gs://${BUCKET_NAME}

echo ""
echo "🎉 CORS setup complete!"
echo ""
echo "⚠️  Note: If you see an error, make sure you:"
echo "   1. Have gcloud CLI installed (https://cloud.google.com/sdk/docs/install)"
echo "   2. Are authenticated: gcloud auth login"
echo "   3. Have permission to modify the bucket"

# Clean up
rm /tmp/cors-config.json

