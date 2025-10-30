import HeaderButton from "@/src/components/HeaderButton"
import NetworkStatusBanner from "@/src/components/NetworkStatusBanner"
import BookForm from "@/src/components/form/BookForm"
import useBookForm from "@/src/hooks/useBookForm"
import { useBook, useUpdateBook } from "@/src/hooks/useBooks"
import type { Book as BookType } from "@/src/types/Book"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const EditBook = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data: book, isLoading } = useBook(Number(id))
  const { mutate: updateBook, isPending: isSaving } = useUpdateBook()

  const { formData, updateFormData, errors, validate } = useBookForm()

  useEffect(() => {
    if (book) {
      updateFormData({
        name: book.name,
        author: book.author,
        editor: book.editor,
        year: book.year.toString(),
        theme: book.theme || "",
        cover: book.cover || "",
        rating: book.rating,
      })
    }
  }, [book, updateFormData])

  const handleSave = () => {
    if (!book) return

    if (!validate()) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs du formulaire")
      return
    }

    const updatedBook: BookType = {
      ...book,
      name: formData.name.trim(),
      author: formData.author.trim(),
      editor: formData.editor.trim(),
      year: Number.parseInt(formData.year),
      theme: formData.theme.trim(),
      cover: formData.cover.trim() || null,
      rating: formData.rating,
    }

    updateBook(updatedBook, {
      onSuccess: () => {
        Alert.alert("Succès", "Le livre a été modifié", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ])
      },
      onError: () => {
        Alert.alert("Erreur", "Impossible de sauvegarder les modifications")
      },
    })
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!book) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Livre non trouvé</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retour</Text>
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
      >
        <View style={styles.header}>
          <HeaderButton icon="x" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Modifier</Text>
          <Pressable
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            )}
          </Pressable>
        </View>

        <BookForm formData={formData} onFormChange={updateFormData} errors={errors} />
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
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    minWidth: 100,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default EditBook