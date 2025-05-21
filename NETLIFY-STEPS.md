# Step by Step Netlify Deployment Guide

This guide will walk you through deploying your Mockitup.ai application to Netlify, step by step.

## Prerequisites

1. A Netlify account (Sign up at [netlify.com](https://netlify.com) if you don't have one)
2. Node.js and npm installed on your computer

## Step 1: Prepare Your Application

Make sure your application is ready for production:

- Run tests: `./test-app.sh`
- Fix any ESLint errors: `./fix-eslint.sh`
- Check that your application runs locally: `./start.sh` (Option 3 or 4)

## Step 2: Use the Interactive Deployment Script

The simplest way to deploy is using our interactive script:

```bash
./deploy-netlify.sh
```

This script will guide you through the entire process.

## Step 3: Follow the Interactive Prompts

1. **Authentication**: You'll be asked to log in to Netlify if you're not already logged in.
2. **Site Creation**: Choose to create a new site or link to an existing site.
3. **Build Process**: The script will build your application for production.
4. **Deployment**: Your site will be deployed to Netlify.

## Step 4: Verify Your Deployment

After deployment completes:

1. Check your deployment status: `./check-netlify-status.sh`
2. Open your site in a browser:
   - If Netlify CLI is installed: `netlify open:site`
   - Or manually visit: `https://your-site-name.netlify.app`

## Step 5: Set Up Custom Domain (Optional)

To use your own domain:

1. Go to the Netlify dashboard: `netlify open`
2. Navigate to "Site settings" > "Domain management"
3. Click "Add custom domain" and follow the instructions

## Troubleshooting

If you encounter any issues during deployment:

1. **Authentication Issues**:
   - Run `netlify logout` and then `netlify login` to refresh your credentials

2. **Build Failures**:
   - Check the build log in the Netlify dashboard
   - Run `npm run build` locally to identify errors
   - Fix any ESLint errors with `./fix-eslint.sh`

3. **Site Already Exists**:
   - Choose "Link to existing site" in the deployment script
   - If needed, delete the `.netlify` folder and try again

4. **Path Issues**:
   - Run `./fix-paths.sh` to correct any path-related problems

## Additional Commands

- **Check Site Status**: `./check-netlify-status.sh`
- **View Netlify Dashboard**: `netlify open`
- **View Site**: `netlify open:site`
- **Create Manual Deployment**: `netlify deploy`

## Need More Help?

For more detailed instructions and troubleshooting, refer to:
- `NETLIFY.md` for comprehensive Netlify guidance
- [Netlify Documentation](https://docs.netlify.com/)
