import { FeaturedCard } from "@/components/Cards";
import { Card } from "@/components/Cards";
import Search from "@/components/Search";
import images from "@/constants/images";
import { fetchProducts } from "@/src/services/productService";
import { Product, ProductResponse } from "@/types/product";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

interface Category {
  slug: string;
  name: string;
  url: string;
}

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (params.category as string) || "all"
  );

  // Load featured products and categories
  useEffect(() => {
    loadInitialData();
    loadCategories();
    loadProducts();
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

  // Reload products when category changes
  useEffect(() => {
    if (categories.length > 0) {
      loadProducts();
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      let data: ProductResponse;

      if (selectedCategory === "all") {
        data = await fetchProducts(4, 0);
      } else {
        // Fetch products by category
        const response = await fetch(
          `https://dummyjson.com/products/category/${selectedCategory}?limit=4`
        );
        data = await response.json();
      }

      setProducts(data.products);
    } catch (error) {
      Alert.alert("Error", "Failed to load products. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-accent-100 h-full">
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
    <SafeAreaView className="bg-accent-100 h-full">
      <FlatList
        data={products}
        renderItem={({ item }) => <Card product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerClassName="pb-2"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="px-5">
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

            {/* Category Filter */}
            <View className="mt-5 mb-5">
              <Text className="text-base font-poppins-semibold text-black-300 mb-3">
                Filter by Category
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                <TouchableOpacity
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === "all"
                      ? "bg-primary-100"
                      : "bg-primary-300"
                  }`}
                  onPress={() => handleCategoryPress("all")}
                >
                  <Text
                    className={`font-poppins-semibold ${
                      selectedCategory === "all"
                        ? "text-accent-100"
                        : "text-black-300"
                    }`}
                  >
                    All
                  </Text>
                </TouchableOpacity>

                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.slug}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category.slug
                        ? "bg-primary-100"
                        : "bg-primary-300"
                    }`}
                    onPress={() => handleCategoryPress(category.slug)}
                  >
                    <Text
                      className={`font-poppins-semibold capitalize ${
                        selectedCategory === category.slug
                          ? "text-accent-100"
                          : "text-black-300"
                      }`}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        }
        ListFooterComponent={
          <View className="px-5 mb-12">
            <TouchableOpacity
              className="bg-primary-100 rounded-xl py-4 mt-8 mb-6 items-center"
              onPress={() => router.push("/products")}
            >
              <Text className="text-accent-100 text-base font-poppins-bold">
                Browse All Products
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
