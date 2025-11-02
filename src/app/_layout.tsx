import { useSyncPendingMutations } from '@/src/hooks/useSyncPendingMutations'
import QueryProvider from '@/src/providers/QueryProvider'
import { ThemeProvider, useTheme } from '@/src/contexts/ThemeContext'
import { Entypo, FontAwesome6, Feather } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const AppContent = () => {
  useSyncPendingMutations()
  const { colors } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="(books)"
        options={{
          title: 'books',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome6 name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          headerShown: false,
          title: 'statistics',
          tabBarIcon: ({ color }) => <Entypo name="gauge" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'settings',
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryProvider>
          <AppContent />
        </QueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}


export default RootLayout