import { useSyncPendingMutations } from "@/src/hooks/useSyncPendingMutations"
import QueryProvider from "@/src/providers/QueryProvider"
import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"

const AppContent = () => {
  useSyncPendingMutations()

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="book/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen name="book/[id]/edit" options={{ headerShown: false }} />
    </Stack>
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