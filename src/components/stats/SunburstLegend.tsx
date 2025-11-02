import { useTheme } from "@/src/contexts/ThemeContext"
import { StyleSheet, Text, View } from "react-native"

const SunburstLegend = () => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.title}>Niveau 1: Lecture</Text>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: colors.success }]} />
          <Text style={styles.text}>Lus</Text>
        </View>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: colors.textSecondary }]} />
          <Text style={styles.text}>Non lus</Text>
        </View>
      </View>
      <View style={styles.column}>
        <Text style={styles.title}>Niveau 2: Thèmes</Text>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: colors.primaryDark }]} />
          <Text style={styles.text}>Par thème (cliquer)</Text>
        </View>
      </View>
      <View style={styles.column}>
        <Text style={styles.title}>Niveau 3: Favoris</Text>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: colors.favorite }]} />
          <Text style={styles.text}>Favoris</Text>
        </View>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: colors.borderLight }]} />
          <Text style={styles.text}>Non favoris</Text>
        </View>
      </View>
    </View>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      gap: 16,
      marginTop: 8,
    },
    column: {
      gap: 8,
    },
    title: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingLeft: 8,
    },
    color: {
      width: 16,
      height: 16,
      borderRadius: 3,
    },
    text: {
      fontSize: 13,
      color: colors.textSecondary,
    },
  })

export default SunburstLegend