# Firebase Setup Instructions

## Deploy Security Rules

1. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

2. Deploy Storage rules:
```bash
firebase deploy --only storage:rules
```

## Configure CORS for Storage (Important for Photo Upload)

If photo uploads are failing, you may need to configure CORS for your Firebase Storage bucket:

1. Install gsutil (Google Cloud SDK):
```bash
# macOS with Homebrew
brew install --cask google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

2. Authenticate with Google Cloud:
```bash
gcloud auth login
```

3. Apply CORS configuration:
```bash
gsutil cors set cors.json gs://doggy-forum.firebasestorage.app
```

## Verify Storage Settings in Firebase Console

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: "doggy-forum"
3. Go to Storage section
4. Check that:
   - Storage is initialized
   - Rules are deployed (should allow public uploads)
   - Your storage bucket is: `doggy-forum.firebasestorage.app`

## Common Issues and Solutions

### Issue: "User does not have permission to access"
**Solution:** Deploy the storage rules using the command above

### Issue: "CORS error when uploading"
**Solution:** Apply the CORS configuration using gsutil

### Issue: "Failed to upload photo: undefined"
**Solution:** Check browser console for detailed error messages

## Testing Upload Locally

1. Open browser developer console (F12)
2. Try uploading a photo
3. Check console for any error messages
4. The console will log:
   - "Uploading to: photos/[filename]"
   - "Upload successful, URL: [url]" (if successful)
   - Error details (if failed)