import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";
import { Stack, SplashScreen } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { CartProvider } from "@/src/context/cartContext";
import AnimatedSplash from "@/components/AnimatedSplash";

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [initializing, setInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-ExtraBold": require('../assets/fonts/Poppins-ExtraBold.ttf'),
    "Poppins-Light": require('../assets/fonts/Poppins-Light.ttf'),
    "Poppins-Medium": require('../assets/fonts/Poppins-Medium.ttf'),
    "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
    "Poppins-SemiBold": require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

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