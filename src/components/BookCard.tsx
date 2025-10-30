import StarRating from "@/src/components/StarRating"
import type { Book } from "@/src/types/Book"
import { Feather } from "@expo/vector-icons"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

interface BookCardProps {
  book: Book
}

const BookCard = ({ book }: BookCardProps) => {
  const router = useRouter()

  const handlePress = () => {
    router.push(`/(books)/book/${book.id}`)
  }

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <View style={styles.content}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: book.cover || `https://placehold.co/120x180/e0e0e0/666666?text=${encodeURIComponent(book.name.slice(0, 1))}`
            }}
            contentFit="cover"
            transition={200}
          />
          {/* Badges */}
          <View style={styles.badges}>
            {book.favorite && (
              <View style={styles.badge}>
                <Feather name="heart" size={14} color="#FF5252" />
              </View>
            )}
            {book.read && (
              <View style={[styles.badge, styles.badgeRead]}>
                <Feather name="check" size={14} color="#4CAF50" />
              </View>
            )}
          </View>
        </View>

        {/* Informations */}
        <View style={styles.info}>
          <View style={styles.mainInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {book.name}
            </Text>
            <Text style={styles.author} numberOfLines={1}>
              {book.author}
            </Text>
            {book.theme && (
              <View style={styles.themeContainer}>
                <View style={styles.themeBadge}>
                  <Text style={styles.themeText}>{book.theme}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Détails supplémentaires */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Feather name="calendar" size={14} color="#999" />
              <Text style={styles.detailText}>{book.year}</Text>
            </View>
            {book.rating > 0 && (
              <View style={styles.detailRow}>
                <StarRating rating={book.rating} size={14} />
                <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          {book.editor && (
            <Text style={styles.editor} numberOfLines={1}>
              Édité par {book.editor}
            </Text>
          )}
        </View>
      </View>

      {/* Indicateur de status */}
      <View style={styles.statusBar}>
        <View style={[styles.statusIndicator, book.read ? styles.statusRead : styles.statusUnread]} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  badges: {
    position: "absolute",
    top: 4,
    right: 4,
    gap: 4,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeRead: {
    backgroundColor: "#fff",
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  mainInfo: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    lineHeight: 20,
  },
  author: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  themeContainer: {
    marginTop: 4,
  },
  themeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  themeText: {
    fontSize: 11,
    color: "#007AFF",
    fontWeight: "600",
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  ratingText: {
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "600",
  },
  editor: {
    fontSize: 11,
    color: "#999",
    fontStyle: "italic",
  },
  statusBar: {
    height: 3,
    width: "100%",
  },
  statusIndicator: {
    height: "100%",
    width: "100%",
  },
  statusRead: {
    backgroundColor: "#4CAF50",
  },
  statusUnread: {
    backgroundColor: "#FF9800",
  },
})

export default BookCard