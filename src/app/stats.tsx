import NetworkStatusBanner from "@/src/components/NetworkStatusBanner"
import AreaChart from "@/src/components/stats/AreaChart"
import CircularProgress from "@/src/components/stats/CircularProgress"
import ModernBarChart from "@/src/components/stats/ModernBarChart"
import MultiLevelSunburst from "@/src/components/stats/MultiLevelSunburst"
import SelectedThemeCard from "@/src/components/stats/SelectedThemeCard"
import StatsOverview from "@/src/components/stats/StatsOverView"
import SunburstLegend from "@/src/components/stats/SunburstLegend"
import { useBooks } from "@/src/hooks/useBooks"
import { useStats } from "@/src/hooks/useStats"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Stats = () => {
  const router = useRouter()
  const { data: stats, isLoading: statsLoading } = useStats()
  const { data: books, isLoading: booksLoading } = useBooks()
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)

  if (statsLoading || booksLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <NetworkStatusBanner />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    )
  }

  if (!stats || !books) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <NetworkStatusBanner />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Impossible de charger les statistiques</Text>
        </View>
      </SafeAreaView>
    )
  }

  const yearStats = books.reduce((acc, book) => {
    const year = book.year.toString()
    acc[year] = (acc[year] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const yearData = Object.entries(yearStats)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .slice(-10)

  const ratingDistribution = [0, 0, 0, 0, 0, 0]
  books.forEach((book) => {
    if (book.rating > 0) {
      const index = Math.floor(book.rating)
      ratingDistribution[index] = (ratingDistribution[index] || 0) + 1
    }
  })

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <NetworkStatusBanner />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>Statistiques</Text>
          <View style={styles.placeholder} />
        </View>

        <StatsOverview
          totalBooks={stats.totalBooks}
          readCount={stats.readCount}
          favoritesCount={stats.favoritesCount}
          averageRating={stats.averageRating}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vue d&apos;ensemble hiérarchique</Text>
          {selectedTheme && (
            <SelectedThemeCard themeName={selectedTheme} onClear={() => setSelectedTheme(null)} />
          )}
          <View style={styles.sunburstContainer}>
            <MultiLevelSunburst books={books} onThemePress={setSelectedTheme} />
          </View>
          <SunburstLegend />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progression de lecture</Text>
          <View style={styles.progressCircleContainer}>
            <CircularProgress
              percentage={(stats.readCount / stats.totalBooks) * 100}
              readCount={stats.readCount}
              totalBooks={stats.totalBooks}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribution des notes</Text>
          <View style={styles.chartContainer}>
            <ModernBarChart data={ratingDistribution} labels={["0★", "1★", "2★", "3★", "4★", "5★"]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Années de publication</Text>
          <View style={styles.chartContainer}>
            <AreaChart data={yearData.map(([_, count]) => count)} labels={yearData.map(([year]) => year)} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  sunburstContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressCircleContainer: {
    alignItems: "center",
  },
  chartContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
})

export default Stats