import HeaderButton from "@/src/components/HeaderButton"
import NetworkStatusBanner from "@/src/components/NetworkStatusBanner"
import BookForm from "@/src/components/form/BookForm"
import useBookForm from "@/src/hooks/useBookForm"
import { useCreateBook } from "@/src/hooks/useBooks"
import type { Book as BookType } from "@/src/types/Book"
import { useRouter } from "expo-router"
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

const CreateBook = () => {
  const router = useRouter()
  const { mutate: createBook, isPending: isSaving } = useCreateBook()

  const { formData, updateFormData, errors, validate, reset } = useBookForm()

  const handleSave = () => {
    if (!validate()) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs du formulaire")
      return
    }

    const newBook: Omit<BookType, "id" | "createdAt"> = {
      name: formData.name.trim(),
      author: formData.author.trim(),
      editor: formData.editor.trim(),
      year: Number.parseInt(formData.year),
      theme: formData.theme.trim(),
      cover: formData.cover.trim() || null,
      rating: formData.rating,
      read: false,
      favorite: false,
    }

    createBook(newBook, {
      onSuccess: () => {
        Alert.alert("Succès", "Le livre a été créé", [
          {
            text: "OK",
            onPress: () => {
              reset()
              router.back()
            },
          },
        ])
      },
      onError: () => {
        Alert.alert("Erreur", "Impossible de créer le livre")
      },
    })
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
          <Text style={styles.headerTitle}>Nouveau livre</Text>
          <Pressable
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Créer</Text>
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
})

export default CreateBook