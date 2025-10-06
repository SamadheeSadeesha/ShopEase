import { useCart } from "@/src/context/cartContext";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Cart() {
  const { cart, updateQuantity, getCartTotal, clearCart } =
    useCart();

  const renderCartItem = ({ item }: any) => (
    <View
      className="bg-white rounded-2xl p-3 mb-4 flex-row border"
      style={{ borderColor: "#BA1D844A" }}
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-20 h-20 rounded-lg"
        resizeMode="contain"
      />

      <View className="flex-1 ml-4">
        <Text
          className="text-base font-poppins-semibold text-black-300"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="text-sm font-poppins text-black-200 mt-1">
          ${item.price.toFixed(2)} each
        </Text>

        <View className="flex-row items-center mt-3">
          <TouchableOpacity
            className="bg-primary-300 rounded-xl w-8 h-8 items-center justify-center"
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text className="text-lg font-poppins-bold text-black-300">-</Text>
          </TouchableOpacity>

          <Text className="mx-4 text-base font-poppins-semibold text-black-300">
            {item.quantity}
          </Text>

          <TouchableOpacity
            className="bg-primary-300 rounded-xl w-8 h-8 items-center justify-center"
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text className="text-lg font-poppins-bold text-black-300">+</Text>
          </TouchableOpacity>

          {/* Add item subtotal */}
          <Text
            className="text-xl font-poppins-bold text-black-300"
            style={{ flex: 1, textAlign: "right" }}
          >
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 mt-5">
        <Text className="text-xl font-poppins-bold text-black-300">
          Shopping Cart
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (cart.length > 0) {
              Alert.alert("Clear Cart", "Remove all items from cart?", [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: clearCart },
              ]);
            }
          }}
        >
          <Text
            className="text-base font-poppins-semibold"
            style={{ color: "#BA1D84" }}
          >
            Clear Cart
          </Text>
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-xl font-poppins-bold text-black-300 mb-2">
            Your cart is empty
          </Text>
          <Text className="text-base font-poppins text-black-200 text-center mb-6">
            Add some products to get started
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "#BA1D84" }}
            className="rounded-full px-8 py-3"
            onPress={() => router.push("/(root)/(tabs)")}
          >
            <Text className="font-poppins-semibold text-white">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="px-5 mt-5 pb-4"
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View className="mt-4 mb-6">
                <TouchableOpacity
                  className="rounded-full py-3 items-center px-8"
                  onPress={() => router.push("/(root)/(tabs)/products")}
                >
                  <Text
                    style={{ color: "#BA1D84" }}
                    className="font-poppins-semibold"
                  >
                    + Add More Items
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />

          {/* Cart Summary - Fixed at bottom */}
          <View className="bg-white px-5 py-6 border-t border-black-100 mb-12">
            <View className="flex-row justify-between mb-4">
              <Text className="text-base font-poppins text-black-200">
                Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                items)
              </Text>
              <Text className="text-2xl font-poppins-bold text-primary-100">
                ${getCartTotal().toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              className="rounded-2xl p-4 mb-4 items-center"
              style={{ backgroundColor: "#BA1D84" }}
              onPress={() =>
                router.push({
                  pathname: "/(root)/checkout",
                  params: {
                    cartItems: JSON.stringify(cart),
                    totalAmount: getCartTotal().toFixed(2),
                  },
                })
              }
            >
              <Text className="text-white text-lg font-poppins-bold">
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
