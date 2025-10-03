# 🚀 HaritKranti Frontend Deployment Guide

This guide covers how to deploy the HaritKranti frontend application to various platforms.

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git (for version control)

## 🏗️ Build Process

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview locally**
   ```bash
   npm run preview
   ```

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**Quick Deploy:**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

**Manual Deploy:**
```bash
npm install -g vercel
vercel --prod
```

### 2. Netlify

**Via Git Integration:**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

**Manual Deploy:**
```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### 3. GitHub Pages

1. Build the project locally
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

### 4. Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### 5. Custom Server

```bash
npm run build
# Serve the 'dist' folder with any static file server
# Example with serve:
npx serve dist -p 3000
```

## ⚙️ Environment Variables

If you need to connect to a backend API, create a `.env` file:

```env
VITE_API_URL=https://your-backend-api.com/api
```

## 🔧 Build Configuration

The application uses Vite for building. Configuration is in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // Change this for subdirectory deployments
})
```

## 📱 Mobile Optimization

The application is already optimized for mobile devices:
- Responsive design
- Touch-friendly interface
- Mobile-first approach
- PWA-ready structure

## 🔒 Security Considerations

- All API calls should use HTTPS
- Implement proper authentication tokens
- Use environment variables for sensitive data
- Enable CORS properly on your backend

## 📊 Performance Optimization

- Images are optimized
- Code splitting is enabled
- CSS is minimized
- Gzip compression recommended

## 🐛 Troubleshooting

**Build Fails:**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for syntax errors

**Deployment Issues:**
- Verify build output in `dist` folder
- Check environment variables
- Ensure proper routing configuration

**API Connection Issues:**
- Verify VITE_API_URL is set correctly
- Check CORS configuration
- Test API endpoints independently

## 📈 Monitoring

After deployment, consider:
- Setting up error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring
- Uptime monitoring

## 🔄 Continuous Deployment

For automated deployments:
1. Set up GitHub Actions
2. Configure build and test steps
3. Deploy on successful builds
4. Set up staging environments

---

**Happy Deploying! 🌱**

