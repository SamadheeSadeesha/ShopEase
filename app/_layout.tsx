import { useEffect, useState } from "react";
import { auth } from "../src/services/firebaseConfig";
import { Stack, SplashScreen, useRouter, useSegments } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { CartProvider } from "@/src/context/cartContext";
import AnimatedSplash from "@/components/AnimatedSplash";
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [initializing, setInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-ExtraBold": require('../assets/fonts/Poppins-ExtraBold.ttf'),
    "Poppins-Light": require('../assets/fonts/Poppins-Light.ttf'),
    "Poppins-Medium": require('../assets/fonts/Poppins-Medium.ttf'),
    "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
    "Poppins-SemiBold": require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Handle routing based on auth state
  useEffect(() => {
    if (initializing || showSplash) return;

    const currentRoute = segments[0];
    const publicRoutes = ['login', 'register'];
    const isPublicRoute = publicRoutes.includes(currentRoute);

    if (!user && !isPublicRoute) {
      // Not logged in and trying to access protected route
      router.replace('/login');
    } else if (user && isPublicRoute) {
      // Logged in and trying to access login/register
      router.replace('/');
    }
  }, [user, segments, initializing, showSplash]);

  useEffect(() => {
    if (fontsLoaded && !initializing) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initializing]);

  if (!fontsLoaded || initializing) {
    return null;
  }

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen name="products" options={{ title: "Products" }} />
        <Stack.Screen name="cart" options={{ title: "Cart" }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        <Stack.Screen name="success" options={{ title: "Success" }} />
      </Stack>
    </CartProvider>
  );
}