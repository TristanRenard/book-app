import { useTheme } from "@/src/contexts/ThemeContext"
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

interface FormInputProps extends TextInputProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  required?: boolean
  error?: string
}

const FormInput = ({
  label,
  value,
  onChangeText,
  required = false,
  error,
  multiline,
  ...textInputProps
}: FormInputProps) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.inputMultiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    inputGroup: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    required: {
      color: colors.error,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    inputMultiline: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      marginTop: 4,
    },
  })

export default FormInput