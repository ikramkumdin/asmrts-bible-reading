#!/usr/bin/env python3

import os
import subprocess
from pathlib import Path
from collections import defaultdict

# Configuration
BUCKET_NAME = "asmrts-bible-audio-files"
LOCAL_AUDIO_DIR = Path("./public/audio")
DESTINATION_PREFIX = "audio/"

def get_existing_files_in_bucket():
    """Get a set of all existing files in the bucket."""
    print("📋 Checking existing files in bucket...")
    gs_path = f"gs://{BUCKET_NAME}/{DESTINATION_PREFIX}"
    
    result = subprocess.run(
        ["gsutil", "-m", "ls", "-r", gs_path],
        capture_output=True,
        text=True
    )
    
    existing = set()
    if result.returncode == 0:
        for line in result.stdout.split('\n'):
            if line.strip() and line.startswith(f"gs://"):
                # Extract the path after the prefix
                full_path = line.split(f"gs://{BUCKET_NAME}/{DESTINATION_PREFIX}")[-1]
                if full_path:
                    existing.add(full_path)
        print(f"   Found {len(existing)} existing files in bucket")
    else:
        print("   Could not list bucket files, will check individually")
    
    return existing


def file_exists_in_bucket(file_path, existing_files):
    """Check if a file exists in the bucket (using cached set)."""
    return file_path in existing_files if existing_files is not None else False


def upload_file_single(local_file, file_path):
    """Upload a single file to the GCP bucket."""
    bucket_path = f"{DESTINATION_PREFIX}{file_path}"
    gs_path = f"gs://{BUCKET_NAME}/{bucket_path}"
    
    try:
        result = subprocess.run(
            ["gsutil", "-h", "Cache-Control:public, max-age=31536000", 
             "-h", "Content-Type:audio/mpeg", "cp", str(local_file), gs_path],
            check=True,
            capture_output=True,
            text=True,
            timeout=60
        )
        return True
    except subprocess.CalledProcessError as e:
        print(f"      ❌ Error: {e.stderr.strip() if e.stderr else str(e)}")
        return False
    except subprocess.TimeoutExpired:
        print(f"      ❌ Timeout uploading file")
        return False


def main():
    print("🚀 Starting audio sync to GCP bucket...")
    print(f"📁 Local directory: {LOCAL_AUDIO_DIR}")
    print(f"🪣 Bucket: {BUCKET_NAME}")
    print(f"📂 Destination prefix: {DESTINATION_PREFIX}")
    print("")
    
    # Get existing files in bucket
    existing_files = get_existing_files_in_bucket()
    print("")
    
    # Find all MP3 files and group by chapter
    mp3_files = list(LOCAL_AUDIO_DIR.rglob("*.mp3"))
    
    if not mp3_files:
        print("No MP3 files found!")
        return
    
    # Group files by chapter directory for better organization
    files_by_chapter = defaultdict(list)
    for mp3_file in mp3_files:
        file_path = str(mp3_file.relative_to(LOCAL_AUDIO_DIR))
        # Get chapter directory (parent of file)
        chapter_dir = str(mp3_file.parent.relative_to(LOCAL_AUDIO_DIR))
        files_by_chapter[chapter_dir].append((mp3_file, file_path))
    
    print(f"Found {len(mp3_files)} MP3 files in {len(files_by_chapter)} chapters")
    print("")
    
    # Track progress
    uploaded = 0
    skipped = 0
    failed = 0
    
    # Process by chapter
    for chapter_idx, (chapter_dir, chapter_files) in enumerate(sorted(files_by_chapter.items()), 1):
        print(f"📖 Chapter [{chapter_idx}/{len(files_by_chapter)}]: {chapter_dir}")
        
        chapter_uploaded = 0
        chapter_skipped = 0
        chapter_failed = 0
        
        for file_idx, (local_file, file_path) in enumerate(sorted(chapter_files), 1):
            total_idx = uploaded + skipped + failed + 1
            
            # Check if file exists
            if file_exists_in_bucket(file_path, existing_files):
                print(f"  [{file_idx}/{len(chapter_files)}] ⏭️  Exists: {file_path}")
                skipped += 1
                chapter_skipped += 1
            else:
                print(f"  [{file_idx}/{len(chapter_files)}] 📤 Uploading: {file_path}")
                if upload_file_single(local_file, file_path):
                    print(f"  [{file_idx}/{len(chapter_files)}] ✅ Uploaded")
                    uploaded += 1
                    chapter_uploaded += 1
                    # Add to existing set to avoid re-checking
                    existing_files.add(file_path)
                else:
                    failed += 1
                    chapter_failed += 1
        
        print(f"  📊 Chapter summary: +{chapter_uploaded} uploaded, {chapter_skipped} skipped, {chapter_failed} failed")
        print("")
    
    # Final Summary
    print("=" * 60)
    print("📊 Final Upload Summary:")
    print(f"   Total files: {len(mp3_files)}")
    print(f"   ✅ Uploaded: {uploaded}")
    print(f"   ⏭️  Skipped (already exist): {skipped}")
    print(f"   ❌ Failed: {failed}")
    print("=" * 60)
    print("")
    print("✅ Sync completed!")


if __name__ == "__main__":
    main()


