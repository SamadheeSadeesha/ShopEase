import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface PaymentProps {
  totalAmount: number;
  onPaymentComplete: () => void;
}

const Payment = forwardRef(({ totalAmount, onPaymentComplete }: PaymentProps, ref) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [ready, setReady] = useState(false);

  const fetchPaymentSheetParams = async () => {
    try {
      const amount = Math.round(totalAmount * 100);
      
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

      const { paymentIntent, ephemeralKey, customer } = 
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
        merchantDisplayName: "ShopEase Store",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        returnURL: "shopease://stripe-redirect",
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

  // Initialize payment sheet when component mounts
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    if (!ready) {
      Alert.alert("Please wait", "Payment sheet is still loading...");
      return;
    }

    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(
          "Payment Failed", 
          error.message || "Payment was cancelled or failed. Please try again."
        );
      } else {
        Alert.alert(
          "Success!",
          "Your payment was successful!",
          [
            {
              text: "OK",
              onPress: onPaymentComplete,
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    }
  };

  // Expose processPayment method to parent via ref
  useImperativeHandle(ref, () => ({
    processPayment: openPaymentSheet,
  }));

  return null;
});

export default Payment;