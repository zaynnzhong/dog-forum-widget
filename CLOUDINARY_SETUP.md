# 📸 Cloudinary Setup for Photo Uploads (FREE)

Since Firebase Storage requires billing, we're using Cloudinary's free tier for image hosting.

## Quick Start (Works Immediately!)

**The app is configured to work with Cloudinary's demo account by default**, so photo uploads should work right away! Just try uploading a photo.

## Optional: Set Up Your Own Cloudinary Account (Recommended)

For better control and organization, create your own free Cloudinary account:

### Step 1: Create Free Cloudinary Account

1. Go to: https://cloudinary.com/users/register/free
2. Sign up for a free account
3. Verify your email

### Step 2: Get Your Cloud Name

1. After logging in, go to Dashboard
2. Find your **Cloud Name** (e.g., "dxxxxx")
3. Copy this name

### Step 3: Create an Upload Preset

1. Go to Settings → Upload
2. Click "Add upload preset"
3. Set:
   - **Preset name**: `dog_forum_uploads`
   - **Signing Mode**: **Unsigned** (IMPORTANT!)
   - **Folder**: `dog-forum`
4. Under "Upload Control":
   - Set "Max file size" to `10 MB`
   - Set "Allowed formats" to `jpg, png, gif, webp`
5. Click "Save"

### Step 4: Update the Code

Edit `src/components/PhotoBooth.js` line 279:

```javascript
// Change from:
`https://api.cloudinary.com/v1_1/dogforum/image/upload`

// To your cloud name:
`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`
```

### Step 5: Test Upload

1. Refresh your browser
2. Go to Photo Booth tab
3. Upload a photo
4. It should work!

## Free Tier Limits (Very Generous!)

Cloudinary's free tier includes:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ 25,000 transformations/month
- ✅ No credit card required
- ✅ Images served via CDN

## Troubleshooting

### "Failed to upload photo"
- The demo account might be rate-limited
- Create your own Cloudinary account (see above)

### Images not displaying
- Check browser console for errors
- Verify Cloudinary cloud name is correct

### Upload seems stuck
- Check file size (must be under 10MB)
- Try a different image format (JPG, PNG)

## How It Works

1. User selects an image
2. Image is uploaded directly to Cloudinary (bypassing Firebase Storage)
3. Cloudinary returns a secure URL
4. URL is saved in Firestore database
5. Image is displayed in the app

## Benefits Over Firebase Storage

- ✅ No billing account required
- ✅ Generous free tier
- ✅ Built-in image optimization
- ✅ Global CDN for fast loading
- ✅ Automatic image transformations

## Current Configuration

The app is configured to:
1. Try uploading to a custom Cloudinary account first
2. Fall back to Cloudinary's demo account if not configured
3. Store image URLs in Firestore (free tier)

This means **uploads work immediately** without any setup!