import { useEffect, useState } from "react";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../src/services/firebaseConfig";

interface SettingItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text
        className={`text-lg font-poppins-medium text-black-300 ${textStyle}`}
      >
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

const Profile = () => {
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user?.email) {
      setUserEmail(user.email);
    }
  });

  return () => unsubscribe();
}, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "You have been logged out successfully");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to logout. Please try again"
      );
      console.error("Logout error: ", error);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-poppins-bold">Profile</Text>
        </View>

        <View className="flex-row justify-center flex mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={images.avatar}
              className="size-44 relative rounded-full"
            />
            <Text className="text-xl font-poppins-bold mt-10">
              {userEmail || "User"}
            </Text>
          </View>
        </View>

        <View className="flex flex-col mt-20 pt-5 items-center">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
