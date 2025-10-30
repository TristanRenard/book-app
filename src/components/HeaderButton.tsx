import { Feather } from "@expo/vector-icons"
import { Pressable, StyleSheet } from "react-native"

interface HeaderButtonProps {
  icon: keyof typeof Feather.glyphMap
  onPress: () => void
  size?: number
}

const HeaderButton = ({ icon, onPress, size = 24 }: HeaderButtonProps) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Feather name={icon} size={size} color="#000" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default HeaderButton