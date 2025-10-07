# ShopEase - E-Commerce Mobile Application

A cross-platform e-commerce mobile application built with React Native and Expo, featuring user authentication, product browsing, shopping cart management and secure payment processing.

## Features

- **User Authentication**: Secure login and registration using Firebase Authentication
- **Product Listing**: Browse products fetched from DummyJSON API with pagination support
- **Shopping Cart**: Add, remove, and manage product quantities with persistent cart storage
- **Secure Checkout**: Integrated Stripe payment gateway for secure transactions
- **Session Persistence**: Users remain logged in across app restarts
- **Responsive UI**: Clean and intuitive user interface with smooth navigation

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Authentication**: Firebase Auth
- **Payment Processing**: Stripe
- **API**: DummyJSON API for product data
- **State Management**: React Context API
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Local Storage**: AsyncStorage for cart persistence

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android Studio (for Android development) or Xcode (for iOS development)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SamadheeSadeesha/shopease.git
cd shopease
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=firebase_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=firebase_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=firebase_measurement_id

EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=stripe_publishable_key
EXPO_PUBLIC_API_URL=backend_api_url
```

### 4. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Email/Password authentication in Authentication section
4. Copy the Firebase configuration values to the `.env` file

### 5. Set Up Stripe

1. Create a [Stripe account](https://stripe.com/)
2. Get the test publishable key from the Stripe Dashboard
3. Add it to the `.env` file
4. Set up the backend server (stripe-server) for payment processing

### 6. Run the Stripe Backend Server

```bash
cd stripe-server
npm install
npm start
```

The server will run on `http://localhost:3000` by default.

### 7. Run the Application

```bash
# Start the Expo development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on web
npx expo start --web
```

## Building for Production

### Build APK for Android

```bash
# Build production APK
eas build --platform android --profile production

# Or build preview APK
eas build --platform android --profile preview
```

### Build for iOS

```bash
eas build --platform ios --profile production
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
