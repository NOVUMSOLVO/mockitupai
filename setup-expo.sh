#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Setting up Expo for Mockitup.ai ===${NC}"
echo

# Install Expo CLI globally
echo -e "${YELLOW}Installing Expo CLI globally...${NC}"
npm install -g expo-cli
echo -e "${GREEN}✓ Expo CLI installed globally${NC}"

# Install required packages
echo -e "${YELLOW}Installing required Expo packages...${NC}"
npm install expo expo-status-bar @expo/webpack-config react-native react-native-web
echo -e "${GREEN}✓ Expo packages installed${NC}"

# Create expo configuration file
echo -e "${YELLOW}Creating Expo configuration...${NC}"
cat > app.json << EOL
{
  "expo": {
    "name": "mockitupai",
    "slug": "mockitupai",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./public/favicon.ico",
    "userInterfaceStyle": "light",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./public/favicon.ico",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./public/favicon.ico"
    }
  }
}
EOL
echo -e "${GREEN}✓ Expo configuration created${NC}"

# Add Expo scripts to package.json
echo -e "${YELLOW}Updating package.json with Expo scripts...${NC}"
node -e "
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts = {
  ...packageJson.scripts,
  'start-expo': 'expo start',
  'android': 'expo start --android',
  'ios': 'expo start --ios',
  'web': 'expo start --web'
};
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
"
echo -e "${GREEN}✓ package.json updated with Expo scripts${NC}"

# Fix permissions
echo -e "${YELLOW}Setting executable permissions...${NC}"
chmod +x setup-expo.sh
echo -e "${GREEN}✓ Permissions set${NC}"

echo
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo -e "${YELLOW}To start your app with Expo Go:${NC}"
echo "1. Run: npm run start-expo"
echo "2. Scan the QR code with the Expo Go app on your mobile device"
echo
echo -e "${GREEN}Happy coding!${NC}"
