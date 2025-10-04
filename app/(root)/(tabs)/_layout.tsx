import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { useCart } from '@/src/context/cartContext'
import icons from '@/constants/icons';

const TabIcon = ({ focused, icon, title, badge }: {focused: boolean; icon: any; title: string; badge?: number }) => (
    <View className='flex-1 mt-3 flex flex-col items-center'>
        <View>
            <Image source={icon} tintColor={focused ? '#BA1D84' : '#666876'} resizeMode='contain' className='size-6' />
            {badge !== undefined && badge > 0 && (
                <View
                    style={{
                        position: 'absolute',
                        right: -8,
                        top: -4,
                        backgroundColor: '#BA1D84',
                        borderRadius: 10,
                        minWidth: 18,
                        height: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 4,
                    }}
                >
                    <Text
                        style={{
                            color: '#FFFFFF',
                            fontSize: 10,
                            fontWeight: 'bold',
                        }}
                    >
                        {badge > 99 ? '99+' : badge}
                    </Text>
                </View>
            )}
        </View>
        <Text className={`${focused ? 'text-primary-100 font-poppins-medium': 'text-black-200 font-poppins'} text-xs w-full text-center mt-1`}>
            {title}
        </Text>
    </View>
)

const TabsLayout = () => {
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: 'white',
                position: 'absolute',
                borderTopColor: '#BA1D84',
                borderTopWidth: 1,
                minHeight: 70,
            }
        }}>
      <Tabs.Screen
        name='index'
        options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.home} focused={focused} title='Home' />
            )
        }} />
        <Tabs.Screen
        name='products'
        options={{
            title: 'Products',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.products} focused={focused} title='Products' />
            )
        }} />
        <Tabs.Screen
        name='cart'
        options={{
            title: 'Cart',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.cart} focused={focused} title='Cart' badge={cartItemCount} />
            )
        }} />
        <Tabs.Screen
        name='profile'
        options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.user} focused={focused} title='Profile' />
            )
        }} />
    </Tabs>
  )
}

export default TabsLayout