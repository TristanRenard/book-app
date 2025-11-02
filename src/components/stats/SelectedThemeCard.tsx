import { useTheme } from "@/src/contexts/ThemeContext"
import { Pressable, StyleSheet, Text, View } from "react-native"

type SelectedThemeCardProps = {
  themeName: string
  onClear: () => void
}

const SelectedThemeCard = ({ themeName, onClear }: SelectedThemeCardProps) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Thème sélectionné</Text>
      <Text style={styles.name}>{themeName}</Text>
      <Pressable style={styles.button} onPress={onClear}>
        <Text style={styles.buttonText}>Effacer</Text>
      </Pressable>
    </View>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.primaryLight,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: "center",
      gap: 8,
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      textTransform: "uppercase",
      fontWeight: "600",
    },
    name: {
      fontSize: 20,
      color: colors.primaryDark,
      fontWeight: "bold",
    },
    button: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: colors.surface,
      fontSize: 12,
      fontWeight: "600",
    },
  })

export default SelectedThemeCard