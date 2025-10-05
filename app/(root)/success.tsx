import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Success() {
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-1 justify-center items-center px-8">
        {/* Success Icon */}
        <View 
          className="w-24 h-24 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: '#4BB543' }}
        >
          <Text className="text-5xl text-white">✓</Text>
        </View>

        {/* Success Message */}
        <Text className="text-2xl font-poppins-bold text-black-300 mb-3 text-center">
          Order Confirmed!
        </Text>
        
        <Text className="text-base font-poppins text-black-200 text-center mb-8">
          Your payment was successful. Thank you for your purchase!
        </Text>

        {/* Order Details */}
        <View 
          className="w-full bg-white rounded-2xl p-6 mb-8"
          style={{ borderWidth: 2, borderColor: '#BA1D84' }}
        >
          <Text className="text-lg font-poppins-semibold text-black-300 mb-4">
            What's Next?
          </Text>
          
          <View className="mb-3">
            <Text className="text-sm font-poppins text-black-200">
              ✓ Payment confirmed
            </Text>
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-poppins text-black-200">
              ✓ Order is being processed
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={{ backgroundColor: "#BA1D84" }}
          className="rounded-2xl py-4 px-8 mb-4 w-full"
          onPress={() => router.push("/(root)/(tabs)/products")}
        >
          <Text 
            className="text-base font-poppins-semibold text-center text-white"
          >
            Continue Shopping
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}