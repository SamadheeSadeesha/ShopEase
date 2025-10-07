import { useEffect, useState } from "react";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user?.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await auth().signOut();
              // Navigation will be handled automatically by the auth state listener in _layout.tsx
            } catch (error: any) {
              setIsLoggingOut(false);
              Alert.alert(
                "Error",
                error.message || "Failed to logout. Please try again"
              );
              console.error("Logout error: ", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
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
          {isLoggingOut ? (
            <View className="py-3">
              <ActivityIndicator size="small" color="#dc2626" />
            </View>
          ) : (
            <SettingsItem
              icon={icons.logout}
              title="Logout"
              textStyle="text-danger"
              showArrow={false}
              onPress={handleLogout}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;