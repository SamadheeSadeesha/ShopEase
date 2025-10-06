import { Card } from "@/components/Cards";
import Search from "@/components/Search";
import { fetchProducts } from "@/src/services/productService";
import { Product, ProductResponse } from "@/types/product";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

export default function Products() {
  const params = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    (params.category as string) || "all"
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 30;
  const [searchQuery, setSearchQuery] = useState("");

  // Add search query effect
  useEffect(() => {
    if (params.query) {
      setSearchQuery(params.query as string);
    } else {
      setSearchQuery("");
    }
  }, [params.query]);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

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
        data = await fetchProducts(LIMIT, 0);
      } else {
        // Fetch products by category
        const response = await fetch(
          `https://dummyjson.com/products/category/${selectedCategory}`
        );
        data = await response.json();
      }

      setProducts(data.products);
      setSkip(LIMIT);
      setHasMore(data.products.length < data.total);
    } catch (error) {
      Alert.alert("Error", "Failed to load products. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load more products for pagination
  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore || selectedCategory !== "all") return;

    try {
      setLoadingMore(true);
      const data: ProductResponse = await fetchProducts(LIMIT, skip);

      setProducts((prev) => [...prev, ...data.products]);
      setSkip((prev) => prev + LIMIT);
      setHasMore(skip + data.products.length < data.total);
    } catch (error) {
      Alert.alert("Error", "Failed to load more products.");
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadProducts();
    } catch (error) {
      Alert.alert("Error", "Failed to refresh products.");
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCategoryPress = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
  };

  // Render footer with loading indicator
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="large" color="#BA1D84" />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#BA1D84" />
          <Text className="mt-4 text-base font-poppins text-black-300">
            Loading products...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const paddedProducts = [...filteredProducts];
  if (paddedProducts.length % 2 !== 0) {
    paddedProducts.push({ id: "empty", isEmpty: true } as any);
  }

  // Main return with FlatList
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
        contentContainerClassName="pb-12"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
        searchQuery ? (
          <View className="px-5 py-10 items-center">
            <Text className="text-xl font-poppins-bold text-black-300 mb-2">
              No products found
            </Text>
            <Text className="text-base font-poppins text-black-200 text-center">
              Try searching with different keywords
            </Text>
          </View>
        ) : null
      }
        ListHeaderComponent={
          <View className="px-5">
            {/* Page Title */}
            <View className="mt-5">
              <Text className="text-xl font-poppins-bold text-black-300">
                All Products
              </Text>
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

            {/* Category Filter - Only show when not searching */}
            {!searchQuery && (
              <View className="mt-5">
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

            <View className="mt-5 mb-3">
              <Text className="text-base font-poppins text-black-200">
                {searchQuery
                  ? `${filteredProducts.length} products found`
                  : selectedCategory === "all"
                    ? `Showing ${filteredProducts.length} products`
                    : `${filteredProducts.length} products in ${
                        categories.find((c) => c.slug === selectedCategory)
                          ?.name || selectedCategory
                      }`}
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
