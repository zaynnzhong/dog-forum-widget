#!/bin/bash

echo "🔧 Fixing Firebase Storage CORS Configuration"
echo "============================================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK not found. Installing..."
    echo "Please run: brew install --cask google-cloud-sdk"
    echo "Or download from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if gsutil is available
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil not found. Please install Google Cloud SDK"
    exit 1
fi

echo "✅ Google Cloud SDK found"

# Authenticate if needed
echo ""
echo "📝 You may need to authenticate with Google Cloud..."
echo "If prompted, log in with the same Google account used for Firebase"
gcloud auth login

# Apply CORS configuration
echo ""
echo "🚀 Applying CORS configuration to Firebase Storage..."
gsutil cors set cors.json gs://doggy-forum.firebasestorage.app

if [ $? -eq 0 ]; then
    echo "✅ CORS configuration applied successfully!"
    echo ""
    echo "🎉 Storage should now work! Try uploading a photo."
else
    echo "❌ Failed to apply CORS configuration"
    echo ""
    echo "Manual steps:"
    echo "1. Go to https://console.firebase.google.com"
    echo "2. Select 'doggy-forum' project"
    echo "3. Go to Storage section"
    echo "4. Click 'Rules' tab"
    echo "5. Make sure rules allow public uploads"
fi