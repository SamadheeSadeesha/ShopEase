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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../src/services/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/products");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require("../assets/images/logo.svg")}
          className="w-[200px] h-[200px]"
          resizeMode="contain"
        />

        <View className="w-full px-5 mt-4">
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
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#8C8E98"
          />

          <Text className="text-base font-poppins-medium text-black-200 mb-2 mt-4">
            Password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#8C8E98"
          />

          {error ? (
            <Text className="text-danger mb-2 mt-2">{error}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row justify-center items-center">
            <Text className="text-black-100 font-poppins-regular">
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push("/register")}>
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
    marginBottom: 10,
    borderRadius: 12,
    fontFamily: "Poppins-Regular",
  },
  loginButton: {
    backgroundColor: "#BA1D84",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
  },
  loginButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
});
