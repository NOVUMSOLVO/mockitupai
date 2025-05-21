# Mockitup.ai

Mockitup.ai is a React-based web application that helps users create stunning product mockups in seconds using AI technology.

## Features

- AI-powered mockup generation
- Template gallery with various categories
- User authentication
- Dashboard for saved projects
- Responsive design for all devices

## Quick Start

The easiest way to get started is using our simple launcher:

```bash
# Make sure you're in the correct directory
cd /Users/valentinechideme/Documents/augment-projects/mockitupai

# Make the script executable first
chmod +x start.sh

# Launch the application
./start.sh
```

This script will guide you through setting up and running the application.

## Deployment

We've added simple deployment scripts to make it easy to deploy your application:

```bash
# Deploy to Netlify
chmod +x deploy-netlify.sh && ./deploy-netlify.sh

# Or deploy to Vercel
chmod +x deploy-vercel.sh && ./deploy-vercel.sh
```

You can also use the interactive menu:
```bash
./start.sh
# Then select option 7 for deployment options
```

For detailed deployment instructions, see:
- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment information
- [NETLIFY.md](NETLIFY.md) - Netlify-specific deployment guide
- [NETLIFY-STEPS.md](NETLIFY-STEPS.md) - Step-by-step Netlify deployment walkthrough

You can also check the status of your Netlify deployment:
```bash
# Check Netlify deployment status
chmod +x check-netlify-status.sh && ./check-netlify-status.sh
```

### Path Issues?

If you encounter path-related issues, we've included a path checker script:

```bash
chmod +x check-paths.sh
./check-paths.sh
```

This will help identify the correct paths for your system.

### Comprehensive Testing

To run comprehensive tests on the application before deployment:

```bash
chmod +x test-app.sh
./test-app.sh
```

This will check your environment, file structure, and run basic connection tests.

## Documentation

We've provided comprehensive documentation to help you get started:

- [QUICKSTART.md](./QUICKSTART.md) - Quick instructions to get up and running
- [RUNNING.md](./RUNNING.md) - Detailed instructions for running the app
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solutions for common issues
- [DEPLOYMENT.md](./DEPLOYMENT.md) - How to deploy the app to various platforms
- [NETLIFY.md](./NETLIFY.md) - Comprehensive Netlify deployment guide
- [NETLIFY-STEPS.md](./NETLIFY-STEPS.md) - Step-by-step Netlify deployment walkthrough

## Manual Setup

If you prefer manual setup:

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mockitupai.git
cd mockitupai
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. If you experience connection issues, try an alternative server:
```bash
# Simple development server
npm run simple-server

# Testing connection
npm run test-connection
```

5. Open your browser and navigate to:
   - Development server: http://localhost:3000
   - Simple server or test connection: http://localhost:5000

## Deployment

### Building for Production

To create an optimized production build, run:

```bash
npm run build
```

The build files will be generated in the `build` folder, ready to be deployed to a static file host.

### Deploy to Netlify

1. Create an account on [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository or upload the build folder
3. Configure your build settings:
   - Build command: `npm run build`
   - Publish directory: `build`

### Deploy to Vercel

1. Create an account on [Vercel](https://vercel.com/)
2. Install the Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the project directory and follow the prompts

## Tech Stack

- React.js
- Tailwind CSS
- JavaScript ES6+

## License

This project is licensed under the MIT License - see the LICENSE file for details.
