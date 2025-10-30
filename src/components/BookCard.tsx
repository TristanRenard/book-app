import type { Book } from "@/src/types/Book"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter()

  const handlePress = () => {
    router.push(`/(books)/book/${book.id}`)
  }

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <Image
        style={styles.image}
        source={{
          uri: book.cover || `https://placehold.co/250x600@2x.png?text=${book.name}`
        }}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{book.name}</Text>
        <Text style={styles.author}>{book.author}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 550,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  info: {
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#666",
  },
})

export default BookCard