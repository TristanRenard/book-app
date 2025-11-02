import { useTheme } from "@/src/contexts/ThemeContext"
import { Feather } from "@expo/vector-icons"
import { Pressable, StyleSheet } from "react-native"

interface HeaderButtonProps {
  icon: keyof typeof Feather.glyphMap
  onPress: () => void
  size?: number
}

const HeaderButton = ({ icon, onPress, size = 24 }: HeaderButtonProps) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Feather name={icon} size={size} color={colors.text} />
    </Pressable>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    button: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },
  })

export default HeaderButton