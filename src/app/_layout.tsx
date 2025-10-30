import { useSyncPendingMutations } from '@/src/hooks/useSyncPendingMutations'
import QueryProvider from '@/src/providers/QueryProvider'
import { Entypo, FontAwesome6 } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const AppContent = () => {
  useSyncPendingMutations()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'books',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome6 name="book" size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AppContent />
      </QueryProvider>
    </SafeAreaProvider>
  )
}


export default RootLayout