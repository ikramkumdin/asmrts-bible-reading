#!/bin/bash

# Script to list all books in the GCP bucket

BUCKET_NAME="asmrts-bible-audio-files"

echo "📚 Listing all books in GCP bucket for Aria preset:"
echo ""
gsutil ls gs://${BUCKET_NAME}/audio/aria/

echo ""
echo "📚 Listing all books in GCP bucket for Heartsease preset:"
echo ""
gsutil ls gs://${BUCKET_NAME}/audio/heartsease/

echo ""
echo "💡 Looking for specific books:"
echo ""
echo "Checking for Jude..."
gsutil ls gs://${BUCKET_NAME}/audio/aria/ | grep -i jude || echo "❌ Jude not found"

echo ""
echo "Checking for 2 John (various naming possibilities)..."
gsutil ls gs://${BUCKET_NAME}/audio/aria/ | grep -iE "2.*john|ii.*john" || echo "❌ 2 John not found"

echo ""
echo "Checking for 3 John (various naming possibilities)..."
gsutil ls gs://${BUCKET_NAME}/audio/aria/ | grep -iE "3.*john|iii.*john" || echo "❌ 3 John not found"

