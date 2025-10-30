import { Feather } from "@expo/vector-icons"
import { Pressable, StyleSheet, Text } from "react-native"

interface ActionButtonProps {
  icon: keyof typeof Feather.glyphMap
  label: string
  isActive: boolean
  onPress: () => void
  activeColor: string
  inactiveColor: string
}

const ActionButton = ({
  icon,
  label,
  isActive,
  onPress,
  activeColor,
  inactiveColor,
}: ActionButtonProps) => {
  return (
    <Pressable
      style={[
        styles.button,
        isActive && { backgroundColor: activeColor, borderColor: activeColor },
      ]}
      onPress={onPress}
    >
      <Feather
        name={icon}
        size={20}
        color={isActive ? "#fff" : inactiveColor}
        fill={icon === "heart" && isActive ? "#fff" : "transparent"}
      />
      <Text style={[styles.text, isActive && styles.textActive]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  textActive: {
    color: "#fff",
  },
})

export default ActionButton