module.exports = {
  expo: {
    name: "shopease",
    slug: "shopease",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo-white.png",
    scheme: "shopease",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/logo-white.png",
      resizeMode: "contain",
      backgroundColor: "#BA1D84"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.tulu.shopease",
      googleServicesFile: "./GoogleService-Info.plist", 
      splash: {
        image: "./assets/images/logo-white.png",
        resizeMode: "contain",
        backgroundColor: "#BA1D84"
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#BA1D84",
        foregroundImage: "./assets/images/logo-black.png"
      },
      package: "com.tulu.shopease",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      splash: {
        image: "./assets/images/logo-white.png",
        resizeMode: "contain",
        backgroundColor: "#BA1D84"
      }
    },
    web: {
      output: "static",
      bundler: "metro",
      favicon: "./assets/images/logo-white.png"
    },
    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      "@react-native-firebase/auth", 
      [
        "expo-splash-screen",
        {
          image: "./assets/images/logo-white.png",
          resizeMode: "contain",
          backgroundColor: "#BA1D84"
        }
      ],
      "expo-secure-store",
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Poppins-Bold.ttf",
            "./assets/fonts/Poppins-ExtraBold.ttf",
            "./assets/fonts/Poppins-Light.ttf",
            "./assets/fonts/Poppins-Medium.ttf",
            "./assets/fonts/Poppins-Regular.ttf",
            "./assets/fonts/Poppins-SemiBold.ttf"
          ]
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "ce937f22-5d89-4c8e-b714-2ad220fc2910"
      }
    }
  }
};