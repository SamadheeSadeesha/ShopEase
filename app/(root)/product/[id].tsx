import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { fetchProductById } from '@/src/services/productService';
import icons from '@/constants/icons';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
          <Text className="text-base font-poppins text-black-300">Product not found</Text>
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
            <Image source={icons.backArrow} className="size-6" />
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
          <Text className="text-2xl font-poppins-bold text-black-300">
            {product.title}
          </Text>

          <View className="flex flex-row items-center mt-2">
            <Image source={icons.star} className="size-4 mr-1" />
            <Text className="text-sm font-poppins text-black-200">
              {product.rating.toFixed(1)} • {product.brand}
            </Text>
          </View>

          <Text className="text-3xl font-poppins-bold text-primary-100 mt-4">
            ${product.price.toFixed(2)}
          </Text>

          <Text className="text-base font-poppins text-black-200 mt-4 leading-6">
            {product.description}
          </Text>

          <View className="flex flex-row items-center mt-4">
            <Text className="text-sm font-poppins text-black-200">
              Stock: {product.stock} units
            </Text>
          </View>
        </View>

        {/* Add to Cart Button */}
        <View className="px-5 mt-10 mb-10">
          <TouchableOpacity 
            className="bg-primary-100 rounded-lg py-4 items-center"
            onPress={() => {
              // Add to cart logic
              Alert.alert("Success", "Product added to cart!");
            }}
          >
            <Text className="text-accent-100 text-lg font-poppins-bold">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}