#!/bin/bash

# Configuration
BUCKET_NAME="asmrts-bible-audio-files"
LOCAL_AUDIO_DIR="./public/audio"
DESTINATION_PREFIX="audio/"

echo "🚀 Starting audio sync to GCP bucket: $BUCKET_NAME"
echo ""

# Function to check if file exists in bucket
file_exists_in_bucket() {
    local file_path=$1
    local bucket_path="${DESTINATION_PREFIX}${file_path}"
    gsutil -q stat "gs://${BUCKET_NAME}/${bucket_path}" 2>/dev/null
    return $?
}

# Function to upload a file
upload_file() {
    local local_file=$1
    local bucket_path="${DESTINATION_PREFIX}${file_path}"
    
    echo "📤 Uploading: $file_path"
    gsutil -m -h "Cache-Control:public, max-age=31536000" -h "Content-Type:audio/mpeg" cp "$local_file" "gs://${BUCKET_NAME}/${bucket_path}"
    
    if [ $? -eq 0 ]; then
        echo "✅ Uploaded: $file_path"
        return 0
    else
        echo "❌ Failed to upload: $file_path"
        return 1
    fi
}

# Counters
uploaded=0
skipped=0
failed=0
total=0

# Find all MP3 files
find "$LOCAL_AUDIO_DIR" -name "*.mp3" -type f | while read -r local_file; do
    total=$((total + 1))
    
    # Get relative path from public/audio
    file_path="${local_file#$LOCAL_AUDIO_DIR/}"
    
    # Remove leading slash if present
    file_path="${file_path#/}"
    
    # Check if file exists in bucket
    if file_exists_in_bucket "$file_path"; then
        echo "⏭️  Skipping (already exists): $file_path"
        skipped=$((skipped + 1))
    else
        # Upload file
        if upload_file "$local_file" "$file_path"; then
            uploaded=$((uploaded + 1))
        else
            failed=$((failed + 1))
        fi
    fi
done

echo ""
echo "📊 Upload Summary:"
echo "   Total files: $total"
echo "   Uploaded: $uploaded"
echo "   Skipped (already exist): $skipped"
echo "   Failed: $failed"
echo ""
echo "✅ Sync completed!"




