import { Stack } from "expo-router"

const AppContent = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="book/index" options={{ headerShown: false }} />
      <Stack.Screen name="book/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen name="book/[id]/edit" options={{ headerShown: false }} />
    </Stack>
  )
}

const RootLayout = () => {
  return (
    <AppContent />
  )
}

export default RootLayout