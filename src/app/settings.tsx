import NetworkStatusBanner from "@/src/components/NetworkStatusBanner"
import { useTheme } from "@/src/contexts/ThemeContext"
import { Feather } from "@expo/vector-icons"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type ThemeMode = "light" | "dark" | "system"

const Settings = () => {
  const { themeMode, setThemeMode, colors } = useTheme()

  const themeOptions: { value: ThemeMode; label: string; icon: string; description: string }[] = [
    {
      value: "light",
      label: "Clair",
      icon: "sun",
      description: "Thème clair en permanence",
    },
    {
      value: "dark",
      label: "Sombre",
      icon: "moon",
      description: "Thème sombre en permanence",
    },
    {
      value: "system",
      label: "Système",
      icon: "smartphone",
      description: "Suit les paramètres du système",
    },
  ]

  const styles = createStyles(colors)

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <NetworkStatusBanner />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apparence</Text>
          <Text style={styles.sectionDescription}>
            Choisissez le thème de couleur de l'application
          </Text>

          <View style={styles.themeOptions}>
            {themeOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.themeOption,
                  themeMode === option.value && styles.themeOptionActive,
                ]}
                onPress={() => setThemeMode(option.value)}
              >
                <View style={styles.themeOptionContent}>
                  <View style={styles.themeOptionLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        themeMode === option.value && styles.iconContainerActive,
                      ]}
                    >
                      <Feather
                        name={option.icon as any}
                        size={24}
                        color={themeMode === option.value ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    <View style={styles.themeOptionText}>
                      <Text
                        style={[
                          styles.themeOptionLabel,
                          themeMode === option.value && styles.themeOptionLabelActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={styles.themeOptionDescription}>{option.description}</Text>
                    </View>
                  </View>
                  {themeMode === option.value && (
                    <View style={styles.checkmark}>
                      <Feather name="check" size={20} color={colors.primary} />
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Application</Text>
              <Text style={styles.infoValue}>Books Manager</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    themeOptions: {
      gap: 12,
    },
    themeOption: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    themeOptionContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    themeOptionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 16,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
    },
    iconContainerActive: {
      backgroundColor: colors.accentLight,
    },
    themeOptionText: {
      flex: 1,
    },
    themeOptionLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    themeOptionLabelActive: {
      color: colors.primaryDark,
    },
    themeOptionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    checkmark: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
  })

export default Settings
