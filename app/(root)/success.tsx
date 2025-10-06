import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";

export default function Success() {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 justify-center items-center px-8">
        {/* Success Icon */}
        <View 
          className="w-24 h-24 rounded-full items-center justify-center mb-8"
        >
          <Image source={icons.check}
          style={{ width: 100, height: 100 }} />
        </View>

        {/* Success Message */}
        <Text className="text-2xl font-poppins-bold text-black-300 mb-3 text-center">
          Order Confirmed!
        </Text>
        
        <Text className="text-base font-poppins text-black-200 text-center mb-8">
          Your payment was successful. Thank you for your purchase!
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          style={{ backgroundColor: "#BA1D84" }}
          className="rounded-2xl py-4 px-8 mb-4 w-full"
          onPress={() => router.push("/(root)/(tabs)/products")}
        >
          <Text 
            className="text-base font-poppins-semibold text-center text-white"
          >
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}