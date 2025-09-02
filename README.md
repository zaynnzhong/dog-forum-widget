# Dog Forum Widget

A React-based embeddable forum widget for dog lovers, featuring text discussions and photo sharing capabilities.

## Features

- **Discussion Forum**: Topic-based text discussions about dog parks, recipes, training, health, grooming, and general chat
- **Photo Booth**: Share photos of pets with captions and likes
- **Firebase Integration**: Real-time data sync and authentication
- **Responsive Design**: Works on all device sizes
- **Custom Styling**: Uses the color palette #ff6620, #f5e8d7, black & white

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Anonymous)
3. Create a Firestore database
4. Enable Storage
5. Copy your Firebase config
6. Create a `.env` file based on `.env.example` and add your Firebase credentials

### 3. Deploy Firebase Rules
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

## Development

```bash
npm start
```
Runs the app in development mode at http://localhost:3000

## Building for Webflow

### 1. Build the widget
```bash
npm run build:widget
```

This creates:
- `widget/dog-forum-widget.html` - The complete widget file
- `widget/embed-code.txt` - Embed code for Webflow

### 2. Host the widget
Upload `dog-forum-widget.html` to your hosting service (e.g., Firebase Hosting, Netlify, Vercel)

### 3. Embed in Webflow
1. In Webflow, add an Embed element where you want the widget
2. Copy the code from `widget/embed-code.txt`
3. Replace `YOUR_HOSTING_URL` with your actual hosting URL
4. Paste the code into the Embed element

## Firebase Security

The included Firebase rules ensure:
- Anyone can read posts and photos
- Only authenticated users can create posts and upload photos
- Users can only edit/delete their own content
- Photo uploads are limited to 10MB and must be image files

## Components

- **App.js**: Main application with routing
- **Navigation.js**: Navigation bar with auth controls
- **Forum.js**: Text discussion forum component
- **PhotoBooth.js**: Photo sharing component
- **AuthModal.js**: Authentication modal for sign in/sign up

## Technologies Used

- React 18
- Firebase (Firestore, Storage, Authentication)
- React Router DOM
- Styled Components
- React Dropzone
- React Icons