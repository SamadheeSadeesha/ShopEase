import { Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import images from "@/constants/images";
import Search from "@/components/search";
import { FeaturedCard } from "@/components/Cards";
import { Product, ProductResponse } from "@/types/product";
import { fetchProducts } from "@/src/services/productService";

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load featured products and categories
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured products
      const data: ProductResponse = await fetchProducts(3, 0);
      setFeaturedProducts(data.products);
    } catch (error) {
      Alert.alert("Error", "Failed to load data. Please try again.");
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
          <Text className="mt-4 text-base font-poppins text-black-300">
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header/Greeting Section */}
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <Image
              source={images.avatar}
              className="size-14 rounded-full"
            />
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xl font-poppins-semibold text-black-300">
                Hello
              </Text>
              <Text className="text-l font-poppins text-black-200">
                Welcome to ShopEase!
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <Search />

        {/* Featured Products Section */}
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-poppins-bold text-black-300">
            Featured Products
          </Text>
        </View>

        {/* Featured Products Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-5"
          contentContainerStyle={{ gap: 20 }}
        >
          {featuredProducts.map((item) => (
            <FeaturedCard key={item.id} product={item} />
          ))}
        </ScrollView>

        {/* Browse All Products Button */}
        <TouchableOpacity 
          className="bg-primary-100 rounded-xl py-4 mt-8 mb-6 items-center"
          onPress={() => router.push("/products")}
        >
          <Text className="text-accent-100 text-base font-poppins-bold">
            Browse All Products
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}