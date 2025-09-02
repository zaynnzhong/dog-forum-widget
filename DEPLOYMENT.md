# Deployment Instructions for Dog Forum Widget

## GitHub Setup and Deployment

### 1. Create a GitHub Repository

1. Go to https://github.com/new
2. Name your repository: `dog-forum-widget`
3. Make it public (required for GitHub Pages)
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### 2. Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add your GitHub repository as remote (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/dog-forum-widget.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

### 3. Update the Homepage URL

Edit `package.json` and update the homepage field with your actual GitHub username:

```json
"homepage": "https://yourusername.github.io/dog-forum-widget"
```

### 4. Deploy to GitHub Pages

Run the deployment command:

```bash
npm run deploy
```

This will:
- Build the production version
- Create a `gh-pages` branch
- Deploy to GitHub Pages

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Source should be set to "Deploy from a branch"
5. Branch should be `gh-pages` and folder should be `/ (root)`
6. Click Save

Your app will be live at: `https://yourusername.github.io/dog-forum-widget`

## Firebase Security Rules Deployment

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase Project

```bash
firebase init
```

Select:
- Firestore
- Storage
- Use existing project: `doggy-forum`

### 4. Deploy Security Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Updating the Widget

To update your deployed widget:

1. Make your changes
2. Commit them:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Embedding in Webflow

Once deployed, you can embed the widget in Webflow:

1. In Webflow, add an Embed element
2. Add this code (replace with your GitHub Pages URL):

```html
<iframe 
  src="https://yourusername.github.io/dog-forum-widget"
  style="width: 100%; height: 800px; border: none; border-radius: 16px;"
  title="Dog Forum Widget">
</iframe>
```

## Environment Variables

The production environment variables are stored in `.env.production` and are already configured with your Firebase project details. These are included in the build but not exposed in the repository due to `.gitignore`.

## Troubleshooting

- If the page shows 404, wait a few minutes for GitHub Pages to deploy
- Make sure the repository is public
- Check that gh-pages branch exists after running `npm run deploy`
- Clear browser cache if updates don't appear