import BookCard from "@/src/components/BookCard"
import NetworkStatusBanner from "@/src/components/NetworkStatusBanner"
import { useBooks, useUpdateBookCovers } from "@/src/hooks/useBooks"
import type { Book } from "@/src/types/Book"
import { useEffect } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Index = () => {
  const { data: books, isLoading, error } = useBooks()
  const { mutate: updateCovers } = useUpdateBookCovers()

  useEffect(() => {
    if (books && books.length > 0) {
      updateCovers(books)
    }
  }, [books, updateCovers])

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <NetworkStatusBanner />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <NetworkStatusBanner />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erreur lors du chargement des livres</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <NetworkStatusBanner />
      <ScrollView style={styles.container}>
        <View style={styles.grid}>
          {books?.map((book: Book, index: number) => (
            <View
              key={book.id}
              style={[
                styles.cardWrapper,
                index === books.length - 1 && styles.lastCard
              ]}
            >
              <BookCard book={book} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    padding: 16,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  lastCard: {
    marginBottom: 0,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
})

export default Index