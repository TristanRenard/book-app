import { useTheme } from "@/src/contexts/ThemeContext"
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
  const { colors } = useTheme()
  const styles = createStyles(colors)

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
        color={isActive ? colors.surface : inactiveColor}
        fill={icon === "heart" && isActive ? colors.surface : "transparent"}
      />
      <Text style={[styles.text, isActive && styles.textActive]}>
        {label}
      </Text>
    </Pressable>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 8,
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    textActive: {
      color: colors.surface,
    },
  })

export default ActionButton