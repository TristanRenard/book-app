import ActionButton from "@/src/components/ActionButton"
import FormInput from "@/src/components/form/FormInput"
import HeaderButton from "@/src/components/HeaderButton"
import InfoRow from "@/src/components/InfoRow"
import NetworkStatusBanner from "@/src/components/NetworkStatusBanner"
import StarRating from "@/src/components/StarRating"
import { useBook, useToggleFavorite, useToggleRead } from "@/src/hooks/useBooks"
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus"
import { useCreateNote, useNotes } from "@/src/hooks/useNotes"
import api from "@/src/utils/api"
import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Book = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { isOnline } = useNetworkStatus()
  const [newNote, setNewNote] = useState("")

  const { data: book, isLoading, error } = useBook(Number(id))
  const { data: notes, isLoading: notesLoading } = useNotes(Number(id))
  const { mutate: toggleFavorite } = useToggleFavorite()
  const { mutate: toggleRead } = useToggleRead()
  const { mutate: createNote, isPending: isCreatingNote } = useCreateNote()

  const handleDelete = () => {
    Alert.alert("Supprimer le livre", "Êtes-vous sûr de vouloir supprimer ce livre ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          api.delete(`/books/${id}`).then(() => {
            router.replace("/")
          })
        },
      },
    ])
  }

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
    router.push(`/(books)/book/${book.id}/edit`)
  }

  const handleAddNote = () => {
    if (!newNote.trim() || !book) return

    createNote(
      { bookId: book.id, content: newNote.trim() },
      {
        onSuccess: () => {
          setNewNote("")
          Alert.alert("Succès", "Note ajoutée avec succès")
        },
        onError: () => {
          Alert.alert("Erreur", "Impossible d'ajouter la note")
        },
      }
    )
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
      <NetworkStatusBanner />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <HeaderButton icon="arrow-left" onPress={() => router.back()} />
            <View style={styles.headerActions}>
              <HeaderButton icon="edit-2" onPress={handleEdit} size={22} />
            </View>
          </View>

          <Image
            style={styles.cover}
            source={{
              uri:
                book.cover ||
                `https://placehold.co/400x600@2x.png?text=${encodeURIComponent(book.name)}`,
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
              <ActionButton
                icon="x"
                label={isOnline ? "Supprimer" : "indisponible hors ligne"}
                isActive={isOnline}
                onPress={handleDelete}
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

          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notes</Text>
            <View style={styles.noteForm}>
              <FormInput
                label="Ajouter une note"
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Écrivez votre note ici..."
                multiline
              />
              <Pressable
                style={[styles.noteButton, isCreatingNote && styles.noteButtonDisabled]}
                onPress={handleAddNote}
                disabled={isCreatingNote || !newNote.trim()}
              >
                {isCreatingNote ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.noteButtonText}>Ajouter la note</Text>
                )}
              </Pressable>
            </View>
            {notesLoading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : notes && notes.length > 0 ? (
              <View style={styles.notesList}>
                {notes.map((note) => (
                  <View key={note.id} style={styles.noteItem}>
                    <Text style={styles.noteContent}>{note.content}</Text>
                    <Text style={styles.noteDate}>
                      {new Date(note.dateISO).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noNotes}>Aucune note pour le moment</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
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
  notesContainer: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  notesTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  notesList: {
    gap: 12,
    marginBottom: 24,
  },
  noteItem: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    gap: 8,
  },
  noteContent: {
    fontSize: 16,
    color: "#000",
    lineHeight: 22,
  },
  noteDate: {
    fontSize: 12,
    color: "#666",
  },
  noNotes: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 24,
    textAlign: "center",
  },
  noteForm: {
    gap: 12,
    marginBottom: 40,
  },
  noteButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  noteButtonDisabled: {
    opacity: 0.6,
  },
  noteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default Book