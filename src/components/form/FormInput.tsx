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
  ...textInputProps
}: FormInputProps) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
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
  inputError: {
    borderColor: "#FF5252",
  },
  errorText: {
    fontSize: 14,
    color: "#FF5252",
    marginTop: 4,
  },
})

export default FormInput