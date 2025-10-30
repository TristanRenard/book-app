import { useNetworkStatus } from "@/src/hooks/useNetworkStatus"
import { Feather } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

const NetworkStatusBanner = () => {
  const { isOnline } = useNetworkStatus()

  if (isOnline) return null

  return (
    <View style={styles.banner}>
      <Feather name="wifi-off" size={16} color="#fff" />
      <Text style={styles.text}>Mode hors ligne - Les modifications seront synchronisées plus tard</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FF9800",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
})

export default NetworkStatusBanner