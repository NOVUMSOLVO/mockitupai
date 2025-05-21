# Expo Go Setup for Mockitup.ai

This guide explains how to set up and run the Mockitup.ai app using Expo Go on your mobile device.

## Prerequisites

- Node.js and npm installed on your computer
- Mobile device with the Expo Go app installed
  - [Download Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)
  - [Download Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Setup Steps

1. **Run the setup script**

   ```bash
   ./setup-expo.sh
   ```

   This script will:
   - Install the Expo CLI globally
   - Install required Expo packages
   - Create Expo configuration files
   - Update package.json with Expo scripts

2. **Start the app with Expo**

   ```bash
   ./start-expo.sh
   ```

   Or alternatively, you can use:

   ```bash
   npm run start-expo
   ```

3. **Connect with your device**

   - When the app starts, a QR code will appear in your terminal
   - Scan the QR code with your device's camera (iOS) or directly from within the Expo Go app (Android)
   - The app will load on your mobile device through Expo Go

## Available Expo Scripts

The following npm scripts are available for Expo:

- `npm run start-expo`: Start the Expo development server
- `npm run android`: Start the app on an Android emulator/device
- `npm run ios`: Start the app on an iOS simulator/device
- `npm run web`: Start the app in a web browser

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are correctly installed:
   ```bash
   npm install
   ```

2. Make sure the setup script has run successfully:
   ```bash
   ./setup-expo.sh
   ```

3. Check that your mobile device and computer are on the same network

4. Try restarting the Expo server with the clear cache flag:
   ```bash
   npm run start-expo -- -c
   ```

5. Make sure your mobile device has the latest version of Expo Go installed
