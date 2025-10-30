import BookCard from "@/src/components/BookCard"
import NetworkStatusBanner from "@/src/components/NetworkStatusBanner"
import { useBooks, useUpdateBookCovers } from "@/src/hooks/useBooks"
import type { Book } from "@/src/types/Book"
import { Entypo, Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type FilterType = "all" | "read" | "unread" | "favorites"
type SortType = "name" | "author" | "year" | "rating"

const Index = () => {
  const { data: books, isLoading, error } = useBooks()
  const { mutate: updateCovers } = useUpdateBookCovers()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [sortType, setSortType] = useState<SortType>("name")
  const [showFilters, setShowFilters] = useState(false)

  const handleAdd = () => {
    router.push("/(books)/book")
  }

  useEffect(() => {
    if (books && books.length > 0) {
      updateCovers(books)
    }
  }, [books, updateCovers])

  const filteredAndSortedBooks = useMemo(() => {
    if (!books) return []

    let filtered = books.filter((book: Book) => {
      const matchesSearch =
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.theme?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilter = (() => {
        switch (filterType) {
          case "read":
            return book.read
          case "unread":
            return !book.read
          case "favorites":
            return book.favorite
          default:
            return true
        }
      })()

      return matchesSearch && matchesFilter
    })

    filtered.sort((a: Book, b: Book) => {
      switch (sortType) {
        case "name":
          return a.name.localeCompare(b.name)
        case "author":
          return a.author.localeCompare(b.author)
        case "year":
          return b.year - a.year
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return filtered
  }, [books, searchQuery, filterType, sortType])

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

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par titre, auteur, thème..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color="#666" />
            </Pressable>
          )}
        </View>
        <Pressable
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Feather name="sliders" size={20} color={showFilters ? "#007AFF" : "#666"} />
        </Pressable>
      </View>

      {/* Filtres */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Afficher</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <Pressable
                style={[styles.filterChip, filterType === "all" && styles.filterChipActive]}
                onPress={() => setFilterType("all")}
              >
                <Text style={[styles.filterChipText, filterType === "all" && styles.filterChipTextActive]}>
                  Tous
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, filterType === "read" && styles.filterChipActive]}
                onPress={() => setFilterType("read")}
              >
                <Feather
                  name="check-circle"
                  size={16}
                  color={filterType === "read" ? "#fff" : "#4CAF50"}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.filterChipText, filterType === "read" && styles.filterChipTextActive]}>
                  Lus
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, filterType === "unread" && styles.filterChipActive]}
                onPress={() => setFilterType("unread")}
              >
                <Feather
                  name="book"
                  size={16}
                  color={filterType === "unread" ? "#fff" : "#FF9800"}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.filterChipText, filterType === "unread" && styles.filterChipTextActive]}>
                  Non lus
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, filterType === "favorites" && styles.filterChipActive]}
                onPress={() => setFilterType("favorites")}
              >
                <Feather
                  name="heart"
                  size={16}
                  color={filterType === "favorites" ? "#fff" : "#FF5252"}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.filterChipText, filterType === "favorites" && styles.filterChipTextActive]}>
                  Favoris
                </Text>
              </Pressable>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Trier par</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <Pressable
                style={[styles.filterChip, sortType === "name" && styles.filterChipActive]}
                onPress={() => setSortType("name")}
              >
                <Text style={[styles.filterChipText, sortType === "name" && styles.filterChipTextActive]}>
                  Titre
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, sortType === "author" && styles.filterChipActive]}
                onPress={() => setSortType("author")}
              >
                <Text style={[styles.filterChipText, sortType === "author" && styles.filterChipTextActive]}>
                  Auteur
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, sortType === "year" && styles.filterChipActive]}
                onPress={() => setSortType("year")}
              >
                <Text style={[styles.filterChipText, sortType === "year" && styles.filterChipTextActive]}>
                  Année
                </Text>
              </Pressable>
              <Pressable
                style={[styles.filterChip, sortType === "rating" && styles.filterChipActive]}
                onPress={() => setSortType("rating")}
              >
                <Text style={[styles.filterChipText, sortType === "rating" && styles.filterChipTextActive]}>
                  Note
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Résultats */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredAndSortedBooks.length} {filteredAndSortedBooks.length > 1 ? "livres" : "livre"}
        </Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.grid}>
          <Pressable onPress={handleAdd} style={styles.addButton}>
            <Entypo name="plus" size={24} color="white" />
          </Pressable>
          {filteredAndSortedBooks.length > 0 ? (
            filteredAndSortedBooks.map((book: Book, index: number) => (
              <View
                key={book.id}
                style={[styles.cardWrapper, index === filteredAndSortedBooks.length - 1 && styles.lastCard]}
              >
                <BookCard book={book} />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="book" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Aucun livre trouvé</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery
                  ? "Essayez de modifier votre recherche"
                  : "Commencez par ajouter un livre"}
              </Text>
            </View>
          )}
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
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  filterButtonActive: {
    backgroundColor: "#E3F2FD",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    gap: 16,
  },
  filterSection: {
    paddingHorizontal: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  grid: {
    padding: 16,
  },
  addButton: {
    width: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  lastCard: {
    marginBottom: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#ccc",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
})

export default Index