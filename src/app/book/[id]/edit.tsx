import ImagePickerComponent from "@/src/components/form/ImagePicker"
import RatingPicker from "@/src/components/form/RatingPicker"
import HeaderButton from "@/src/components/HeaderButton"
import { useBook, useUpdateBook } from "@/src/hooks/useBooks"
import type { Book as BookType } from "@/src/types/Book"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const EditBook = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data: book, isLoading } = useBook(Number(id))
  const { mutate: updateBook, isPending: isSaving } = useUpdateBook()

  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [editor, setEditor] = useState("")
  const [year, setYear] = useState("")
  const [theme, setTheme] = useState("")
  const [cover, setCover] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (book) {
      setName(book.name)
      setAuthor(book.author)
      setEditor(book.editor)
      setYear(book.year.toString())
      setTheme(book.theme || "")
      setCover(book.cover || "")
      setRating(book.rating)
    }
  }, [book])

  const handleSave = () => {
    if (!book) return

    if (!name.trim() || !author.trim() || !editor.trim() || !year.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    const yearNumber = Number.parseInt(year)
    if (Number.isNaN(yearNumber) || yearNumber < 0) {
      Alert.alert("Erreur", "L'année doit être un nombre valide")
      return
    }

    const updatedBook: BookType = {
      ...book,
      name: name.trim(),
      author: author.trim(),
      editor: editor.trim(),
      year: yearNumber,
      theme: theme.trim(),
      cover: cover.trim() || null,
      rating,
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

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.imageSection}>
            <ImagePickerComponent
              currentImageUrl={cover}
              onImageSelected={setCover}
            />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Titre <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Titre du livre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Auteur <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={author}
                onChangeText={setAuthor}
                placeholder="Nom de l'auteur"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Éditeur <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={editor}
                onChangeText={setEditor}
                placeholder="Nom de l'éditeur"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Année <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                placeholder="Année de publication"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Thème</Text>
              <TextInput
                style={styles.input}
                value={theme}
                onChangeText={setTheme}
                placeholder="Thème du livre (optionnel)"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Note</Text>
              <RatingPicker size={48} value={rating} onChange={setRating} />
            </View>
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
  container: {
    flex: 1,
  },
  imageSection: {
    padding: 20,
  },
  form: {
    padding: 20,
    paddingTop: 0,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  required: {
    color: "#FF5252",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
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