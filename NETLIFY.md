# Netlify Deployment Guide for Mockitup.ai

This guide provides detailed instructions for deploying the Mockitup.ai application to Netlify.

## Prerequisites

Before deploying, ensure you have:

- A Netlify account (sign up for free at [netlify.com](https://netlify.com))
- Node.js and npm installed on your system
- The Mockitup.ai repository cloned to your local system

## Automated Deployment

The easiest way to deploy is using our automated script:

```bash
./deploy-netlify.sh
```

This script will:

1. Check and fix path issues
2. Install Netlify CLI if not already installed
3. Authenticate with Netlify (if not already authenticated)
4. Create a new Netlify site or link to an existing one
5. Build the React application
6. Deploy the build to Netlify

Follow the interactive prompts during the deployment process.

## Manual Deployment

If you prefer to deploy manually, follow these steps:

### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 2. Authenticate with Netlify

```bash
netlify login
```

This will open a browser window for authentication.

### 3. Create a new site

```bash
netlify sites:create --name mockitup-ai
```

Replace `mockitup-ai` with your preferred site name.

### 4. Build the application

```bash
npm run build
```

### 5. Deploy to Netlify

```bash
netlify deploy --prod
```

When prompted, specify `build` as the deploy path.

## Deployment Configuration

The `netlify.toml` file in the project root contains the deployment configuration:

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This configuration:
- Specifies the build command
- Sets the publish directory
- Configures redirects for SPA (Single Page Application) support

## Post-Deployment

After deployment:

1. Visit your site at `https://your-site-name.netlify.app`
2. Set up a custom domain (optional):
   - Go to your Netlify dashboard
   - Navigate to Domain settings
   - Follow the instructions to add and configure your domain

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in Netlify
   - Verify build commands work locally
   - Check for missing dependencies

2. **Authentication Issues**
   - Run `netlify logout` and then `netlify login` again

3. **Path Issues**
   - Ensure you're in the correct project directory
   - Run `./fix-paths.sh` to correct path problems

4. **Deployment Fails**
   - Check for ESLint errors: `./fix-eslint.sh`
   - Verify your Netlify account has necessary permissions
   - Check Netlify build hooks or environment variables

For additional help, refer to [Netlify Support Documentation](https://docs.netlify.com/), or run `netlify help`.
