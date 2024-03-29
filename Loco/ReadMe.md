# React Native Project Setup Guide

## Step 1: Install React Native CLI

Make sure you have Node.js and npm installed on your machine. Then, install the React Native CLI globally using the following command:

```bash
npm install -g react-native
```

## Step 2: Create a New React Native Project

Create a new React Native project using the following command. Replace YourProjectName with the desired name for your project.

```bash
npx react-native init YourProjectName
```

## Step 3: Navigate to the Project Directory

Change to the newly created project directory:

```bash
cd YourProjectName
```

## Step 4: Replace App.js File

Replace the  App.js file with App.js from repository.

## Step 5: Add assets and components Folders

Download and add assets and components folders

## Step 6: Replace package.json File

Replace the  package.json file with package.json from repository.

## Step 7: Edit AndroidManifest.xml

Add these two statement to AndroidManifest.xml file and change android:windowSoftInputMode to adjustPan inside acitivity
Path:android/app/src/main/AndroidManifest.xml

```bash
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

 <activity
        ...........
        android:windowSoftInputMode="adjustPan"
        >
```

## Step 8: Save the Changes

If the project name is not Loco change name in package.json file

```bash
{
  "name": "Your Project Name",
  ......
```
Save the changes to the package.json file.

## Step 9: Install Dependencies
Run the following command to install the updated dependencies:

```bash
npm install
```

This command will read the updated package.json file and install the required dependencies for your project.

## Step 10: Run Your React Native App
Run your React Native app on an emulator or a physical device. Make sure your emulator or device is connected or started. Use the following command:

```bash
npx react-native run-android  # for Android
# or
npx react-native run-ios      # for iOS
```
