#!/bin/bash

# Script to verify audio files in GCP bucket

BUCKET_NAME="asmrts-bible-audio-files"
CHAPTER="1"

echo "🔍 Verifying audio files in GCP bucket..."
echo ""

# Check Jude
echo "📖 Checking JUDE:"
BOOK="jude"
echo "📁 Aria preset:"
gsutil ls -lh gs://${BUCKET_NAME}/audio/aria/${BOOK}/chapter${CHAPTER}/ 2>/dev/null || echo "❌ Not found"
echo ""

# Check 2 John
echo "📖 Checking 2 JOHN:"
BOOK="2john"
echo "📁 Aria preset:"
gsutil ls -lh gs://${BUCKET_NAME}/audio/aria/${BOOK}/chapter${CHAPTER}/ 2>/dev/null || echo "❌ Not found"
echo "URL: https://storage.googleapis.com/${BUCKET_NAME}/audio/aria/${BOOK}/chapter${CHAPTER}/chapter${CHAPTER}.mp3"
echo ""

# Check 3 John
echo "📖 Checking 3 JOHN:"
BOOK="3john"
echo "📁 Aria preset:"
gsutil ls -lh gs://${BUCKET_NAME}/audio/aria/${BOOK}/chapter${CHAPTER}/ 2>/dev/null || echo "❌ Not found"
echo "URL: https://storage.googleapis.com/${BUCKET_NAME}/audio/aria/${BOOK}/chapter${CHAPTER}/chapter${CHAPTER}.mp3"
echo ""

echo "📝 To make files public, run:"
echo "gsutil -m acl ch -u AllUsers:R gs://${BUCKET_NAME}/audio/aria/jude/**"
echo "gsutil -m acl ch -u AllUsers:R gs://${BUCKET_NAME}/audio/aria/2john/**"
echo "gsutil -m acl ch -u AllUsers:R gs://${BUCKET_NAME}/audio/aria/3john/**"

