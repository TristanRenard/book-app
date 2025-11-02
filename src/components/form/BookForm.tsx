import FormInput from "@/src/components/form/FormInput"
import ImagePickerComponent from "@/src/components/form/ImagePicker"
import RatingPicker from "@/src/components/form/RatingPicker"
import { useTheme } from "@/src/contexts/ThemeContext"
import { ScrollView, StyleSheet, Text, View } from "react-native"

interface BookFormData {
  name: string
  author: string
  editor: string
  year: string
  theme: string
  cover: string
  rating: number
}

interface BookFormProps {
  formData: BookFormData
  onFormChange: (data: Partial<BookFormData>) => void
  errors?: Partial<Record<keyof BookFormData, string>>
}

const BookForm = ({ formData, onFormChange, errors = {} }: BookFormProps) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageSection}>
        <ImagePickerComponent
          currentImageUrl={formData.cover}
          onImageSelected={(url) => onFormChange({ cover: url })}
        />
      </View>

      <View style={styles.form}>
        <FormInput
          label="Titre"
          value={formData.name}
          onChangeText={(text) => onFormChange({ name: text })}
          placeholder="Titre du livre"
          required
          error={errors.name}
        />

        <FormInput
          label="Auteur"
          value={formData.author}
          onChangeText={(text) => onFormChange({ author: text })}
          placeholder="Nom de l'auteur"
          required
          error={errors.author}
        />

        <FormInput
          label="Éditeur"
          value={formData.editor}
          onChangeText={(text) => onFormChange({ editor: text })}
          placeholder="Nom de l'éditeur"
          required
          error={errors.editor}
        />

        <FormInput
          label="Année"
          value={formData.year}
          onChangeText={(text) => onFormChange({ year: text })}
          placeholder="Année de publication"
          keyboardType="numeric"
          required
          error={errors.year}
        />

        <FormInput
          label="Thème"
          value={formData.theme}
          onChangeText={(text) => onFormChange({ theme: text })}
          placeholder="Thème du livre (optionnel)"
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Note</Text>
          <RatingPicker
            size={48}
            value={formData.rating}
            onChange={(rating) => onFormChange({ rating })}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.text,
    },
  })

export default BookForm