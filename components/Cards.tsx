import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Product } from '@/types/product';
import icons from '@/constants/icons';

interface CardProps {
  product: Product;
}

export const Card = ({ product }: CardProps) => {
  const handlePress = () => {
    // Navigate to product detail page
    router.push(`/product/${product.id}`);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className='flex-1 bg-white rounded-lg border border-primary-100 p-3 mb-5'
    >
      <Image 
        source={{ uri: product.thumbnail }} 
        className='w-full h-32 rounded-lg mb-2'
        resizeMode='cover'
      />
      
      <Text 
        className='text-sm font-poppins-semibold text-black-300 mb-1'
        numberOfLines={2}
      >
        {product.title}
      </Text>
      
      <View className='flex flex-row items-center mb-2'>
        <Image source={icons.star} className='size-3 mr-1' />
        <Text className='text-xs font-poppins text-black-200'>
          {product.rating.toFixed(1)}
        </Text>
      </View>
      
      <View className='flex flex-row items-center justify-between'>
        <Text className='text-lg font-poppins-bold text-primary-100'>
          ${product.price.toFixed(2)}
        </Text>
        
        <TouchableOpacity 
          className='bg-primary-100 rounded-full p-2'
          onPress={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
        >
          <Image source={icons.cart} className='size-4 tint-white' />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const FeaturedCard = ({ product }: CardProps) => {
  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const discountedPrice = product.price - (product.price * product.discountPercentage / 100);

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className='w-64 bg-white rounded-lg border border-primary-100 p-3'
    >
      <View className='relative'>
        <Image 
          source={{ uri: product.thumbnail }} 
          className='w-full h-40 rounded-lg mb-2'
          resizeMode='cover'
        />
        
        {product.discountPercentage > 0 && (
          <View className='absolute top-2 right-2 bg-primary-100 rounded-full px-2 py-2'>
            <Text className='text-xs font-poppins-bold text-accent-100'>
              -{product.discountPercentage.toFixed(0)}%
            </Text>
          </View>
        )}
      </View>
      
      <Text 
        className='text-sm font-poppins-semibold text-black-300 mb-1'
        numberOfLines={2}
      >
        {product.title}
      </Text>
      
      <View className='flex flex-row items-center mb-2'>
        <Image source={icons.star} className='size-3 mr-1' />
        <Text className='text-xs font-poppins text-black-200'>
          {product.rating.toFixed(1)} • {product.brand}
        </Text>
      </View>
      
      <View className='flex flex-row items-center justify-between'>
        <View className='flex flex-col'>
          <Text className='text-lg font-poppins-bold text-primary-100'>
            ${discountedPrice.toFixed(2)}
          </Text>
          {product.discountPercentage > 0 && (
            <Text className='text-xs font-poppins text-black-200 line-through'>
              ${product.price.toFixed(2)}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          className='bg-primary-100/60 rounded-full p-2'
          onPress={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
        >
          <Image source={icons.cart} className='size-4' />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};