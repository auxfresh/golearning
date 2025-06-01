# EduLearn - Online Coding Course Platform

A comprehensive, mobile-first online coding course platform built with React, Express, and Firebase.

## Features

- **Video Lessons**: Interactive video player with progress tracking
- **Quiz System**: Instant feedback with XP rewards
- **Progress Tracking**: Complete course completion tracking
- **Achievement System**: Badges and leaderboards for motivation
- **Community Features**: Discussion forums for peer learning
- **Mobile-First Design**: Optimized for all devices
- **Firebase Authentication**: Secure Google sign-in

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, Node.js
- **Authentication**: Firebase Auth
- **UI Components**: Radix UI, Lucide React icons
- **State Management**: TanStack Query
- **Build Tool**: Vite

## Deployment to Netlify

### Prerequisites

1. A Netlify account
2. A Firebase project with authentication enabled
3. The following environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_PROJECT_ID`

### Deploy Steps

1. **Fork or clone this repository**

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`

4. **Set Environment Variables**:
   In Netlify dashboard > Site settings > Environment variables, add:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

5. **Deploy**: Click "Deploy site"

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Add your Netlify domain to authorized domains
4. Copy the configuration values to Netlify environment variables

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with your Firebase config

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:5000](http://localhost:5000)

## File Structure

```
├── client/src/           # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and configurations
├── server/              # Express backend
├── netlify/functions/   # Netlify serverless functions
├── shared/              # Shared types and schemas
└── netlify.toml         # Netlify configuration
```

## Key Features Detail

### Authentication
- Google OAuth through Firebase
- Automatic user profile creation
- Protected routes for authenticated users

### Learning System
- Course browsing with filters
- Video lesson progression
- Quiz completion with instant feedback
- XP and level system

### Community
- Discussion forums
- User leaderboards
- Achievement sharing

### Progress Tracking
- Lesson completion status
- Course progress percentages
- Learning streaks
- Achievement unlocks

## Environment Variables

Required for deployment:

- `VITE_FIREBASE_API_KEY`: Firebase project API key
- `VITE_FIREBASE_APP_ID`: Firebase application ID  
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID

## Support

For deployment issues or questions, check the Netlify deployment logs and ensure all environment variables are properly configured.