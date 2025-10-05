import icons from "@/constants/icons";
import { useCart } from "@/src/context/cartContext";
import { Product } from "@/types/product";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  product: Product;
}

export const Card = ({ product }: CardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handlePress = () => {
    // Navigate to product detail page
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-1 rounded-2xl border p-3 mb-5 bg-white"
      style={{
        borderWidth: 1,
        borderColor: "#BA1D844A"
      }}
    >
      <Image
        source={{ uri: product.thumbnail }}
        className="w-full h-32 rounded-lg mb-2"
        resizeMode="cover"
      />

      <Text
        className="text-sm font-poppins-semibold text-black-300 mb-1"
        numberOfLines={2}
      >
        {product.title}
      </Text>

      <View className="flex flex-row items-center mb-2">
        <Image source={icons.star} className="size-3 mr-1" />
        <Text className="text-xs font-poppins text-black-200">
          {product.rating.toFixed(1)}
        </Text>
      </View>

      <View className="flex flex-row items-center justify-between">
        <Text className="text-lg font-poppins-bold text-primary-100">
          ${product.price.toFixed(2)}
        </Text>

        <TouchableOpacity
          className="rounded-full p-2"
          onPress={handleAddToCart}
        >
          <Image
            source={icons.add}
            className="size-6"
            style={{ tintColor: "#BA1D84" }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const FeaturedCard = ({ product }: CardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-64 rounded-2xl border p-3 bg-white"
      style={{
        borderWidth: 1,
        borderColor: "#BA1D844A"
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: product.thumbnail }}
          className="w-full h-40 rounded-lg mb-2"
          resizeMode="cover"
        />
      </View>

      <Text
        className="text-sm font-poppins-semibold text-black-300 mb-1"
        numberOfLines={2}
      >
        {product.title}
      </Text>

      <View className="flex flex-row items-center mb-2">
        <Image source={icons.star} className="size-3 mr-1" />
        <Text className="text-xs font-poppins text-black-200">
          {product.rating.toFixed(1)} • {product.brand}
        </Text>
      </View>

      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-col">
          <Text className="text-lg font-poppins-bold text-primary-100">
            ${product.price.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          className="rounded-full p-2"
          onPress={handleAddToCart}
        >
          <Image
            source={icons.add}
            className="size-6"
            style={{ tintColor: "#BA1D84" }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
