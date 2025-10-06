import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../src/services/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Clear errors when user types
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError("");
    setError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError("");
    setError("");
  };

  // Validate form before submission
  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setError("");

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  // Error messages
  const getFirebaseErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/invalid-credential":
        return "Invalid email or password";
      default:
        return "Login failed. Please try again";
    }
  };

  const handleLogin = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/(root)/(tabs)");
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-8">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require("../assets/images/logo-black.png")}
          className="w-[120px] h-[120px]"
          resizeMode="contain"
        />
        <View className="w-full px-5 mt-12">
          <Text className="text-2xl text-center uppercase font-poppins-semibold text-black-200 mb-4">
            Login
          </Text>
          <Text className="text-3xl font-poppins-bold text-primary-100 text-center mb-6">
            Welcome Back!
          </Text>

          <Text className="text-base font-poppins-medium text-black-200 mb-2">
            Email
          </Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#8C8E98"
            editable={!loading}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Text className="text-base font-poppins-medium text-black-200 mb-2 mt-4">
            Password
          </Text>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Enter your password"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            placeholderTextColor="#8C8E98"
            editable={!loading}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          {error ? <Text style={styles.generalError}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading ? styles.loginButtonDisabled : null,
            ]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View className="mt-6 flex-row justify-center items-center">
            <Text className="text-black-100 font-poppins-regular">
              Don't have an account?
            </Text>
            <Pressable
              onPress={() => router.push("/register")}
              disabled={loading}
            >
              <Text className="text-primary-100 font-poppins-semibold ml-1">
                Register
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 4,
    borderRadius: 12,
    fontFamily: "Poppins-Regular",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
    marginTop: 2,
  },
  generalError: {
    color: "#DC2626",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#BA1D84",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
});
