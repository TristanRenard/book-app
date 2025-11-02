import StarRating from "@/src/components/StarRating"
import { useTheme } from "@/src/contexts/ThemeContext"
import type { Book } from "@/src/types/Book"
import { Feather } from "@expo/vector-icons"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

interface BookCardProps {
  book: Book
}

const BookCard = ({ book }: BookCardProps) => {
  const { colors } = useTheme()
  const router = useRouter()

  const handlePress = () => {
    router.push(`/(books)/book/${book.id}`)
  }

  const styles = createStyles(colors)

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: book.cover || `https://placehold.co/600x600/e0e0e0/666666?text=${encodeURIComponent(book.name.slice(0, 1))}`
            }}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.badges}>
            {book.favorite && (
              <View style={styles.badge}>
                <Feather name="heart" size={14} color={colors.favorite} />
              </View>
            )}
            {book.read && (
              <View style={[styles.badge, styles.badgeRead]}>
                <Feather name="check" size={14} color={colors.read} />
              </View>
            )}
          </View>
        </View>

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
              <Feather name="calendar" size={14} color={colors.textTertiary} />
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

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: "hidden",
      elevation: 3,
      shadowColor: colors.shadow,
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
      backgroundColor: colors.surfaceVariant,
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
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    badgeRead: {
      backgroundColor: colors.surface,
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
      color: colors.text,
      lineHeight: 20,
    },
    author: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    themeContainer: {
      marginTop: 4,
    },
    themeBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    themeText: {
      fontSize: 11,
      color: colors.primaryDark,
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
      color: colors.textTertiary,
      fontWeight: "500",
    },
    ratingText: {
      fontSize: 12,
      color: colors.accent,
      fontWeight: "600",
    },
    editor: {
      fontSize: 11,
      color: colors.textTertiary,
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
      backgroundColor: colors.read,
    },
    statusUnread: {
      backgroundColor: colors.warning,
    },
  })

export default BookCard