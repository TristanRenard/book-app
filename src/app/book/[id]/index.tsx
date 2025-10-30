import ActionButton from "@/src/components/ActionButton"
import HeaderButton from "@/src/components/HeaderButton"
import InfoRow from "@/src/components/InfoRow"
import StarRating from "@/src/components/StarRating"
import { useBook, useToggleFavorite, useToggleRead } from "@/src/hooks/useBooks"
import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Book = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data: book, isLoading, error } = useBook(Number(id))
  const { mutate: toggleFavorite, isPending: isFavoriteLoading } = useToggleFavorite()
  const { mutate: toggleRead, isPending: isReadLoading } = useToggleRead()

  const handleFavorite = () => {
    if (!book) return
    toggleFavorite(book)
  }

  const handleRead = () => {
    if (!book) return
    toggleRead(book)
  }

  const handleEdit = () => {
    if (!book) return
    router.push(`/book/${book.id}/edit`)
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (error || !book) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Livre non trouvé</Text>
        <Pressable style={styles.backButtonError} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <HeaderButton icon="arrow-left" onPress={() => router.back()} />
          <View style={styles.headerActions}>
            <HeaderButton icon="edit-2" onPress={handleEdit} size={22} />
          </View>
        </View>

        <Image
          style={styles.cover}
          source={{
            uri: book.cover || `https://placehold.co/400x600@2x.png?text=${encodeURIComponent(book.name)}`
          }}
          contentFit="contain"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{book.name}</Text>

          <View style={styles.actionButtons}>
            <ActionButton
              icon="check-circle"
              label={book.read ? "Lu" : "Marquer comme lu"}
              isActive={book.read}
              onPress={handleRead}
              activeColor="#4CAF50"
              inactiveColor="#4CAF50"
            />
            <ActionButton
              icon="heart"
              label={book.favorite ? "Favori" : "Ajouter aux favoris"}
              isActive={book.favorite}
              onPress={handleFavorite}
              activeColor="#FF5252"
              inactiveColor="#FF5252"
            />
          </View>

          {book.rating > 0 && (
            <View style={styles.ratingContainer}>
              <StarRating rating={book.rating} />
              <Text style={styles.ratingText}>{book.rating}/5</Text>
            </View>
          )}

          <View style={styles.infoSection}>
            <InfoRow icon="user" label="Auteur" value={book.author} />
            <InfoRow icon="book-open" label="Éditeur" value={book.editor} />
            <InfoRow icon="calendar" label="Année" value={book.year.toString()} />
            {book.theme && <InfoRow icon="tag" label="Thème" value={book.theme} />}
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
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  cover: {
    width: "100%",
    height: 400,
    marginBottom: 16,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    gap: 12,
  },
  ratingText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  infoSection: {
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  backButtonError: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default Book