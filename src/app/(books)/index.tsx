import BookCard from "@/src/components/BookCard"
import FilterDrawer from "@/src/components/FilterDrawer"
import NetworkStatusBanner from "@/src/components/NetworkStatusBanner"
import { useTheme } from "@/src/contexts/ThemeContext"
import { useBooks, useUpdateBookCovers } from "@/src/hooks/useBooks"
import type { Book } from "@/src/types/Book"
import { Entypo, Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export type FilterOptions = {
  readStatus: "all" | "read" | "unread"
  favoriteStatus: "all" | "favorites" | "non-favorites"
  theme: string | null
  minRating: number
}

const Index = () => {
  const { colors } = useTheme()
  const { data: books, isLoading, error } = useBooks()
  const { mutate: updateCovers } = useUpdateBookCovers()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    readStatus: "all",
    favoriteStatus: "all",
    theme: null,
    minRating: 0,
  })

  const handleAdd = () => {
    router.push("/(books)/book")
  }

  useEffect(() => {
    if (books && books.length > 0) {
      updateCovers(books)
    }
  }, [books, updateCovers])

  const filteredBooks = useMemo(() => {
    if (!books) return []

    return books.filter((book) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.theme?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesReadStatus =
        filters.readStatus === "all" ||
        (filters.readStatus === "read" && book.read) ||
        (filters.readStatus === "unread" && !book.read)

      const matchesFavoriteStatus =
        filters.favoriteStatus === "all" ||
        (filters.favoriteStatus === "favorites" && book.favorite) ||
        (filters.favoriteStatus === "non-favorites" && !book.favorite)

      const matchesTheme = !filters.theme || book.theme === filters.theme

      const matchesRating = book.rating >= filters.minRating

      return matchesSearch && matchesReadStatus && matchesFavoriteStatus && matchesTheme && matchesRating
    })
  }, [books, searchQuery, filters])

  const availableThemes = useMemo(() => {
    if (!books) return []
    const themes = new Set(books.map((book) => book.theme).filter((theme): theme is string => !!theme))
    return Array.from(themes).sort()
  }, [books])

  const hasActiveFilters =
    filters.readStatus !== "all" ||
    filters.favoriteStatus !== "all" ||
    filters.theme !== null ||
    filters.minRating > 0

  const styles = createStyles(colors)

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <NetworkStatusBanner />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Feather name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par titre, auteur ou thème..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textTertiary}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} style={styles.clearButton}>
                <Feather name="x" size={20} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setIsFilterDrawerOpen(true)}
          >
            <Feather name="filter" size={20} color={hasActiveFilters ? colors.primary : colors.textSecondary} />
            {hasActiveFilters && <View style={styles.filterBadge} />}
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.grid}>
            <Pressable onPress={handleAdd} style={styles.addButton}>
              <Entypo name="plus" size={24} color="white" />
            </Pressable>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book: Book, index: number) => (
                <View
                  key={book.id}
                  style={[styles.cardWrapper, index === filteredBooks.length - 1 && styles.lastCard]}
                >
                  <BookCard book={book} />
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Feather name="book-open" size={48} color={colors.borderLight} />
                <Text style={styles.emptyText}>Aucun livre trouvé</Text>
                {(searchQuery || hasActiveFilters) && (
                  <Text style={styles.emptyHint}>Essayez de modifier vos critères de recherche</Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <FilterDrawer
        visible={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        availableThemes={availableThemes}
      />
    </SafeAreaView>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInputWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surfaceVariant,
      borderRadius: 8,
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 16,
      color: colors.text,
    },
    clearButton: {
      padding: 4,
    },
    filterButton: {
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: colors.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    filterButtonActive: {
      backgroundColor: colors.primaryLight,
    },
    filterBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    scrollView: {
      flex: 1,
    },
    grid: {
      padding: 16,
    },
    addButton: {
      width: "100%",
      backgroundColor: colors.primary,
      borderRadius: 8,
      height: 50,
      borderStyle: "dashed",
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
    emptyContainer: {
      paddingVertical: 60,
      alignItems: "center",
      gap: 12,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    emptyHint: {
      fontSize: 14,
      color: colors.textTertiary,
      textAlign: "center",
    },
    errorText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  })

export default Index