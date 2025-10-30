import { Pressable, StyleSheet, Text, View } from "react-native"

type SelectedThemeCardProps = {
  themeName: string
  onClear: () => void
}

const SelectedThemeCard = ({ themeName, onClear }: SelectedThemeCardProps) => {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  name: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "bold",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
})

export default SelectedThemeCard