import { Product, ProductResponse } from "@/types/product";

const BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async (limit: number = 30, skip: number = 0): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data: ProductResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data: Product = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/products/search?q=${query}`);
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    const data: ProductResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};