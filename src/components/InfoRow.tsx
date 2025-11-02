import { useTheme } from "@/src/contexts/ThemeContext"
import { Feather } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

interface InfoRowProps {
  icon: keyof typeof Feather.glyphMap
  label: string
  value: string
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Feather name={icon} size={18} color={colors.textSecondary} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: 12,
    },
    label: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    value: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
  })

export default InfoRow