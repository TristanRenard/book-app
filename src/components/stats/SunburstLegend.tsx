import { StyleSheet, Text, View } from "react-native"

const SunburstLegend = () => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.title}>Niveau 1: Lecture</Text>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.text}>Lus</Text>
        </View>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: "#9E9E9E" }]} />
          <Text style={styles.text}>Non lus</Text>
        </View>
      </View>
      <View style={styles.column}>
        <Text style={styles.title}>Niveau 2: Thèmes</Text>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: "#007AFF" }]} />
          <Text style={styles.text}>Par thème (cliquer)</Text>
        </View>
      </View>
      <View style={styles.column}>
        <Text style={styles.title}>Niveau 3: Favoris</Text>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: "#FF5252" }]} />
          <Text style={styles.text}>Favoris</Text>
        </View>
        <View style={styles.item}>
          <View style={[styles.color, { backgroundColor: "#E0E0E0" }]} />
          <Text style={styles.text}>Non favoris</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    color: "#000",
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
    color: "#666",
  },
})

export default SunburstLegend