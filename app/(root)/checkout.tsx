import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useCart } from "@/src/context/cartContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import Payment from "@/components/Payment";

export default function Checkout() {
  const params = useLocalSearchParams();
  const { clearCart } = useCart();

  const cartItems = params.cartItems
    ? JSON.parse(params.cartItems as string)
    : [];
  const totalAmount = parseFloat(params.totalAmount as string);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "card", // 'card' or 'cash'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValidated, setIsFormValidated] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      if (formData.paymentMethod === "cash") {
        // Handle cash on delivery
        const orderData = {
          items: cartItems,
          total: totalAmount,
          customer: formData,
          orderDate: new Date().toISOString(),
          paymentMethod: "cash",
        };

        console.log("Order placed:", orderData);

        Alert.alert(
          "Order Placed!",
          "Your order has been successfully placed. Pay on delivery.",
          [
            {
              text: "OK",
              onPress: () => {
                clearCart();
                router.push("/(root)/(tabs)");
              },
            },
          ]
        );
      } else {
        // For card payment, show the payment section
        setIsFormValidated(true);
      }
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    keyboardType = "default",
    multiline = false,
  }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-poppins-semibold text-black-300 mb-2">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        className="bg-white border rounded-xl p-3 font-poppins text-black-300"
        style={{
          borderColor: error ? "#EF4444" : "#E5E7EB",
          borderWidth: 1,
          textAlignVertical: multiline ? "top" : "center",
        }}
      />
      {error && (
        <Text
          className="text-xs font-poppins mt-1"
          style={{ color: "#EF4444" }}
        >
          {error}
        </Text>
      )}
    </View>
  );

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.identifier"
      urlScheme="shopease"
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 px-4">
          {/* Header */}
          <View className="flex-row items-center py-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-2xl text-black-300">←</Text>
            </TouchableOpacity>
            <Text className="text-xl font-poppins-bold text-black-300 ml-4">
              Checkout
            </Text>
          </View>

          {/* Order Summary */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-lg font-poppins-bold text-black-300 mb-3">
              Order Summary
            </Text>
            {cartItems.map((item: any) => (
              <View key={item.id} className="flex-row justify-between mb-2">
                <Text
                  className="font-poppins text-black-200 flex-1"
                  numberOfLines={1}
                >
                  {item.title} x {item.quantity}
                </Text>
                <Text className="font-poppins-semibold text-black-300">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View
              className="border-t mt-3 pt-3"
              style={{ borderColor: "#E5E7EB" }}
            >
              <View className="flex-row justify-between">
                <Text className="text-lg font-poppins-bold text-black-300">
                  Total
                </Text>
                <Text
                  className="text-lg font-poppins-bold"
                  style={{ color: "#BA1D84" }}
                >
                  ${totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-lg font-poppins-bold text-black-300 mb-4">
              Contact Information
            </Text>
            <InputField
              label="Full Name"
              value={formData.fullName}
              onChangeText={(text: string) =>
                setFormData({ ...formData, fullName: text })
              }
              placeholder="John Doe"
              error={errors.fullName}
            />
            <InputField
              label="Email"
              value={formData.email}
              onChangeText={(text: string) =>
                setFormData({ ...formData, email: text })
              }
              placeholder="john@example.com"
              keyboardType="email-address"
              error={errors.email}
            />
            <InputField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text: string) =>
                setFormData({ ...formData, phone: text })
              }
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
              error={errors.phone}
            />
          </View>

          {/* Delivery Address */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-lg font-poppins-bold text-black-300 mb-4">
              Delivery Address
            </Text>
            <InputField
              label="Address"
              value={formData.address}
              onChangeText={(text: string) =>
                setFormData({ ...formData, address: text })
              }
              placeholder="123 Main Street"
              multiline
              error={errors.address}
            />
            <InputField
              label="City"
              value={formData.city}
              onChangeText={(text: string) =>
                setFormData({ ...formData, city: text })
              }
              placeholder="New York"
              error={errors.city}
            />
            <InputField
              label="Postal Code"
              value={formData.postalCode}
              onChangeText={(text: string) =>
                setFormData({ ...formData, postalCode: text })
              }
              placeholder="10001"
              keyboardType="numeric"
              error={errors.postalCode}
            />
          </View>

          {/* Payment Method */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-lg font-poppins-bold text-black-300 mb-4">
              Payment Method
            </Text>
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 rounded-xl mb-3"
              onPress={() =>
                setFormData({ ...formData, paymentMethod: "card" })
              }
            >
              <Text className="font-poppins-semibold text-black-300">
                💳 Credit/Debit Card
              </Text>
              <View
                className="w-6 h-6 rounded-full border-2 items-center justify-center"
                style={{
                  borderColor:
                    formData.paymentMethod === "card" ? "#BA1D84" : "#9CA3AF",
                }}
              >
                {formData.paymentMethod === "card" && (
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#BA1D84" }}
                  />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-4 rounded-xl"
              onPress={() =>
                setFormData({ ...formData, paymentMethod: "cash" })
              }
            >
              <Text className="font-poppins-semibold text-black-300">
                💵 Cash on Delivery
              </Text>
              <View
                className="w-6 h-6 rounded-full border-2 items-center justify-center"
                style={{
                  borderColor:
                    formData.paymentMethod === "cash" ? "#BA1D84" : "#9CA3AF",
                }}
              >
                {formData.paymentMethod === "cash" && (
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#BA1D84" }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Place Order / Payment Button */}
          {isFormValidated && formData.paymentMethod === "card" ? (
            <View className="mb-8">
              <Payment />
            </View>
          ) : (
            <TouchableOpacity
              className="rounded-2xl p-4 mb-8 items-center"
              style={{ backgroundColor: "#BA1D84" }}
              onPress={handlePlaceOrder}
            >
              <Text className="text-white text-lg font-poppins-bold">
                {formData.paymentMethod === "card"
                  ? "Continue to Payment"
                  : "Place Order"}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </StripeProvider>
  );
}
