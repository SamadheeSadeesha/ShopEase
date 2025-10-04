import { Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { useCart } from "@/src/context/cartContext";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const Checkout = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { getCartTotal, cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const fetchPaymentSheetParams = async () => {
    try {
      const amount = Math.round(getCartTotal() * 100); // Convert to cents
      
      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "usd",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment params");
      }

      const { paymentIntent, ephemeralKey, customer, publishableKey } = 
        await response.json();

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error("Error fetching payment sheet params:", error);
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "TuluTech Store",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: "Customer",
        },
      });

      if (error) {
        Alert.alert("Error", error.message);
        setReady(false);
      } else {
        setReady(true);
      }
    } catch (error) {
      console.error("Error initializing payment sheet:", error);
      setReady(false);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    if (!ready) {
      Alert.alert("Please wait", "Payment sheet is still loading...");
      return;
    }

    setLoading(true);

    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        // Payment failed or was cancelled
        Alert.alert(
          "Payment Failed", 
          error.message || "Payment was cancelled or failed. Please try again."
        );
      } else {
        // Payment succeeded
        Alert.alert(
          "Success!",
          "Your payment was successful!",
          [
            {
              text: "OK",
              onPress: () => {
                clearCart();
                router.push("/success");
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={{ backgroundColor: "#BA1D84" }}
      className="rounded-full py-4 items-center"
      onPress={openPaymentSheet}
      disabled={loading || !ready}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text className="text-lg font-poppins-bold text-white">
          {ready ? "Proceed to Checkout" : "Loading..."}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Checkout;