import { Card, FeaturedCard } from "@/components/Cards";
import Search from "@/components/Search";
import images from "@/constants/images";
import { fetchProducts } from "@/src/services/productService";
import { Product, ProductResponse } from "@/types/product";
import { router, useLocalSearchParams } from "expo-router";
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
  const [searchQuery, setSearchQuery] = useState("");

  // Add search query effect
  useEffect(() => {
    if (params.query) {
      setSearchQuery(params.query as string);
    } else {
      setSearchQuery("");
    }
  }, [params.query]);

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
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

      // Fetch products and filter for high-rated ones (rating > 4.5)
      const data: ProductResponse = await fetchProducts(50, 0); // Fetch more products to filter from
      const highRatedProducts = data.products.filter(
        (product) => product.rating > 4.5
      );

      // Take only the first 3 high-rated products as featured
      setFeaturedProducts(highRatedProducts.slice(0, 3));
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

  // Add padding for filtered products
  const paddedProducts = [...filteredProducts];
  if (paddedProducts.length % 2 !== 0) {
    paddedProducts.push({ id: "empty", isEmpty: true } as any);
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={paddedProducts}
        renderItem={({ item }) => {
          if ("isEmpty" in item) {
            return <View style={{ flex: 1 }} />;
          }
          return <Card product={item} />;
        }}
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
                <View className="flex flex-col items-start ml-4 justify-center">
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
            <Search
              initialQuery={searchQuery}
              onQueryChange={(query) => setSearchQuery(query)}
            />

            {searchQuery && (
              <View className="mt-3">
                <Text className="text-sm font-poppins text-black-200">
                  Searching for:{" "}
                  <Text className="font-poppins-semibold text-primary-100">
                    {searchQuery}
                  </Text>
                </Text>
              </View>
            )}

            {/* Featured Products Section - Only show when not searching */}
            {!searchQuery && (
              <>
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
              </>
            )}

            {/* Category Filter - Only show when not searching */}
            {!searchQuery && (
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
                          ? "text-white"
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
                            ? "text-white"
                            : "text-black-300"
                        }`}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Show product count */}
            {searchQuery && (
              <View className="mb-3">
                <Text className="text-sm font-poppins text-black-200">
                  {filteredProducts.length} products found
                </Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          filteredProducts.length > 0 ? (
            <View className="px-5 mb-10">
              <TouchableOpacity
                className="bg-primary-100 rounded-2xl py-4 mb-6 items-center"
                onPress={() => router.push("/(root)/(tabs)/products")}
              >
                <Text className="text-lg font-poppins-bold text-white">
                  Browse All Products
                </Text>
              </TouchableOpacity>
            </View>
          ) : searchQuery ? (
            <View className="px-5 py-10 items-center">
              <Text className="text-lg font-poppins-bold text-black-300 mb-2">
                No products found
              </Text>
              <Text className="text-sm font-poppins text-black-200 text-center">
                Try searching with different keywords
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
