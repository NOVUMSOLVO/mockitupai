# Deployment Guide for Mockitup.ai

This guide provides detailed instructions for deploying your Mockitup.ai application to various hosting platforms.

> **Note**: For a more detailed Netlify-specific deployment guide, please refer to [NETLIFY.md](./NETLIFY.md).

## Quick Deployment (Recommended)

We've created simplified deployment scripts that handle all the common issues and streamline the deployment process:

### For Netlify:
```bash
# Make the script executable
chmod +x deploy-netlify.sh

# Run the deployment script
./deploy-netlify.sh
```

### For Vercel:
```bash
# Make the script executable
chmod +x deploy-vercel.sh

# Run the deployment script
./deploy-vercel.sh
```

These scripts will:
- Check and fix path issues automatically
- Install necessary CLI tools if missing
- Build your application
- Deploy to the respective platform
- Handle common deployment problems

## Prerequisites

Before deploying, ensure you have:

1. A complete and working React application
2. Run `npm run build` to create a production build
3. A GitHub account if deploying to GitHub Pages, Netlify, or Vercel
4. Accounts on the respective deployment platforms

## Option 1: Netlify Deployment

Netlify offers free hosting with continuous deployment from Git repositories.

### Deploying via Netlify UI

1. Create an account at [Netlify](https://www.netlify.com/)
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, BitBucket)
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Click "Deploy site"

### Deploying via Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to your Netlify account:
   ```bash
   netlify login
   ```

3. Initialize your project:
   ```bash
   netlify init
   ```

4. Follow the prompts to set up your site

5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

## Option 2: Vercel Deployment

Vercel specializes in React application deployments with zero configuration.

### Deploying via Vercel UI

1. Create an account at [Vercel](https://vercel.com/)
2. Click "Import Project"
3. Select "Import Git Repository" and connect your GitHub/GitLab/BitBucket account
4. Select your repository
5. Configure project settings if needed (defaults work well for React apps)
6. Click "Deploy"

### Deploying via Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Option 3: GitHub Pages

GitHub Pages is free and integrates well with GitHub repositories.

1. Install the gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add the following to your package.json:
   ```json
   "homepage": "https://yourusername.github.io/mockitupai",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Option 4: Firebase Hosting

Google Firebase offers fast and secure hosting with a generous free tier.

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Select your Firebase project
   - Set "build" as your public directory
   - Configure as a single-page app: Yes
   - Don't overwrite index.html: No

4. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Option 5: AWS Amplify

AWS Amplify provides hosting with built-in CI/CD and other AWS service integrations.

1. Install the AWS Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Configure Amplify:
   ```bash
   amplify configure
   ```

3. Initialize your project:
   ```bash
   amplify init
   ```

4. Add hosting:
   ```bash
   amplify add hosting
   ```
   - Select "Hosting with Amplify Console"
   - Choose "Continuous deployment"

5. Publish:
   ```bash
   amplify publish
   ```

## Custom Domain Setup

For each of the platforms above, you can configure a custom domain:

1. **Netlify**: Site settings → Domain management → Add custom domain
2. **Vercel**: Project settings → Domains → Add domain
3. **GitHub Pages**: Repository settings → Pages → Custom domain
4. **Firebase**: Firebase console → Hosting → Connect domain
5. **AWS Amplify**: Amplify console → App settings → Domain management

## Post-Deployment Steps

After successful deployment:

1. Verify that your application works correctly
2. Set up analytics (Google Analytics, etc.)
3. Configure any environment variables needed
4. Set up monitoring
5. Implement CI/CD for automatic deployments

## Troubleshooting Common Deployment Issues

### Page Not Found (404) Errors

For SPAs, ensure your hosting provider is configured to redirect all requests to index.html.

### Build Failures

Check your build logs for errors. Common issues include:
- Missing dependencies
- Environment variable issues
- Node.js version incompatibility

### Performance Issues

If your deployed app is slow:
1. Use code splitting
2. Optimize images
3. Enable compression
4. Use a CDN
5. Implement caching strategies

### Path Issues

If you're encountering "No such file or directory" errors:
1. Use our `fix-paths.sh` script to correct path problems
2. Ensure you're using `/Users/valentinechideme/...` not `/valentinechideme/...`
3. Check the terminal output for detailed error messages

### CLI Tool Issues

If you're seeing "could not determine executable to run" errors:
1. Try installing the CLI tool globally: `npm install -g netlify-cli` or `npm install -g vercel`
2. Use our deployment scripts which handle these issues automatically
3. Try using npx: `npx netlify-cli deploy --prod` or `npx vercel --prod`

### ESLint Warnings

If you see ESLint warnings about invalid `href` attributes:
1. Fix the links by adding valid URLs or using onClick handlers with buttons instead of empty links
2. Add `{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}` before problematic links if they're intentionally empty
3. Create proper routing for all page links in your React application
