import icons from "@/constants/icons";
import { useCart } from "@/src/context/cartContext";
import { fetchProductById } from "@/src/services/productService";
import { Product } from "@/types/product";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await fetchProductById(Number(id));
      setProduct(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load product details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Add the product with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      Alert.alert("Success", `${quantity} x ${product.title} added to cart!`, [
        {
          text: "OK",
          onPress: () => {
            router.push("/cart");
          },
        },
      ]);
      setQuantity(1); // Reset quantity after adding
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#BA1D84" />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="bg-white h-full">
        <View className="flex-1 justify-center items-center">
          <Text className="text-base font-poppins text-black-300">
            Product not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex flex-row items-center justify-between px-5 mt-5">
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={icons.backArrow}
              className="size-8"
              style={{ tintColor: "#BA1D84" }}
            />
          </TouchableOpacity>
          <Text className="text-xl font-poppins-bold">Product Details</Text>
          <View className="size-6" />
        </View>

        {/* Product Image */}
        <Image
          source={{ uri: product.thumbnail }}
          className="w-full h-80 mt-5"
          resizeMode="cover"
        />

        {/* Product Info */}
        <View className="px-5 mt-5">
          <Text className="text-sm font-poppins text-black-200">
            {product.brand}
          </Text>
          <Text className="text-2xl font-poppins-bold text-black-300">
            {product.title}
          </Text>

          <View className="flex flex-row items-center mt-2">
            <Image source={icons.star} className="size-4 mr-1" />
            <Text className="text-sm font-poppins text-black-200">
              {product.rating.toFixed(1)}
            </Text>
          </View>

          <Text className="text-2xl font-poppins-bold mt-4">
            ${product.price.toFixed(2)}
          </Text>

          <Text className="text-base font-poppins text-black-200 mt-4 leading-6">
            {product.description}
          </Text>

          <View className="flex flex-row items-center mt-4 mb-4">
            <Text className="text-sm font-poppins text-black-200">
              Stock: {product.stock} units
            </Text>
          </View>

          {/* Quantity Controls */}
          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-primary-300 rounded-xl w-10 h-10 items-center justify-center"
              onPress={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Text className="text-lg font-poppins-bold text-black-300">
                -
              </Text>
            </TouchableOpacity>

            <Text className="mx-4 text-lg font-poppins-semibold text-black-300">
              {quantity}
            </Text>

            <TouchableOpacity
              className="bg-primary-300 rounded-xl w-10 h-10 items-center justify-center"
              onPress={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
            >
              <Text className="text-lg font-poppins-bold text-black-300">
                +
              </Text>
            </TouchableOpacity>
            <Text
              className="text-3xl font-poppins-bold text-primary-100"
              style={{ flex: 1, textAlign: "right" }}
            >
              ${(product.price * quantity).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Add to Cart Button */}
        <View className="px-5 mt-10 mb-10">
          <TouchableOpacity
            className="bg-primary-100 rounded-2xl py-4 items-center"
            onPress={handleAddToCart}
          >
            <Text className="text-lg font-poppins-bold text-white">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
