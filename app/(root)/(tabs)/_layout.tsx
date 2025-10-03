import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

import icons from '@/constants/icons';

const TabIcon = ({ focused, icon, title }: {focused: boolean; icon: any; title: string }) => (
    <View className='flex-1 mt-3 flex flex-col items-center'>
        <Image source={icon} tintColor={focused ? '#BA1D84' : '#666876'} resizeMode='contain' className='size-6' />
        <Text className={`${focused ? 'text-primary-100 font-poppins-medium': 'text-black-200 font-poppins'} text-xs w-full text-center mt-1`}>
            {title}
        </Text>
    </View>
)

const TabsLayout = () => {
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
                <TabIcon icon={icons.cart} focused={focused} title='Cart' />
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