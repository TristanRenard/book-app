import { Feather } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

type StatsOverviewProps = {
  totalBooks: number
  readCount: number
  favoritesCount: number
  averageRating: number
}

const StatsOverview = ({ totalBooks, readCount, favoritesCount, averageRating }: StatsOverviewProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.grid}>
          <View style={styles.item}>
            <Feather name="book" size={24} color="#007AFF" />
            <Text style={styles.value}>{totalBooks}</Text>
            <Text style={styles.label}>Livres</Text>
          </View>

          <View style={styles.item}>
            <Feather name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.value}>{readCount}</Text>
            <Text style={styles.label}>Lus</Text>
          </View>

          <View style={styles.item}>
            <Feather name="heart" size={24} color="#FF5252" />
            <Text style={styles.value}>{favoritesCount}</Text>
            <Text style={styles.label}>Favoris</Text>
          </View>

          <View style={styles.item}>
            <Feather name="star" size={24} color="#FFD700" />
            <Text style={styles.value}>{averageRating.toFixed(1)}</Text>
            <Text style={styles.label}>Moyenne</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: "50%",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  label: {
    fontSize: 13,
    color: "#666",
  },
})

export default StatsOverview