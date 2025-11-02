import type { FilterOptions } from "@/src/app/(books)/index"
import { useTheme } from "@/src/contexts/ThemeContext"
import { Feather } from "@expo/vector-icons"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

interface FilterDrawerProps {
  visible: boolean
  onClose: () => void
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  availableThemes: string[]
}

const FilterDrawer = ({ visible, onClose, filters, onFiltersChange, availableThemes }: FilterDrawerProps) => {
  const { colors } = useTheme()

  const handleReset = () => {
    onFiltersChange({
      readStatus: "all",
      favoriteStatus: "all",
      theme: null,
      minRating: 0,
    })
  }

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const styles = createStyles(colors)

  if (!visible) return null

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.drawer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filtres</Text>
            <View style={styles.headerButtons}>
              <Pressable onPress={handleReset} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Réinitialiser</Text>
              </Pressable>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statut de lecture</Text>
              <View style={styles.optionsRow}>
                <Pressable
                  style={[styles.option, filters.readStatus === "all" && styles.optionActive]}
                  onPress={() => updateFilter("readStatus", "all")}
                >
                  <Text style={[styles.optionText, filters.readStatus === "all" && styles.optionTextActive]}>
                    Tous
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.option, filters.readStatus === "read" && styles.optionActive]}
                  onPress={() => updateFilter("readStatus", "read")}
                >
                  <Text style={[styles.optionText, filters.readStatus === "read" && styles.optionTextActive]}>
                    Lus
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.option, filters.readStatus === "unread" && styles.optionActive]}
                  onPress={() => updateFilter("readStatus", "unread")}
                >
                  <Text style={[styles.optionText, filters.readStatus === "unread" && styles.optionTextActive]}>
                    Non lus
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Favoris</Text>
              <View style={styles.optionsRow}>
                <Pressable
                  style={[styles.option, filters.favoriteStatus === "all" && styles.optionActive]}
                  onPress={() => updateFilter("favoriteStatus", "all")}
                >
                  <Text
                    style={[styles.optionText, filters.favoriteStatus === "all" && styles.optionTextActive]}
                  >
                    Tous
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.option, filters.favoriteStatus === "favorites" && styles.optionActive]}
                  onPress={() => updateFilter("favoriteStatus", "favorites")}
                >
                  <Text
                    style={[styles.optionText, filters.favoriteStatus === "favorites" && styles.optionTextActive]}
                  >
                    Favoris
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.option, filters.favoriteStatus === "non-favorites" && styles.optionActive]}
                  onPress={() => updateFilter("favoriteStatus", "non-favorites")}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.favoriteStatus === "non-favorites" && styles.optionTextActive,
                    ]}
                  >
                    Non favoris
                  </Text>
                </Pressable>
              </View>
            </View>

            {availableThemes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thème</Text>
                <View style={styles.themeOptions}>
                  <Pressable
                    style={[styles.themeOption, filters.theme === null && styles.themeOptionActive]}
                    onPress={() => updateFilter("theme", null)}
                  >
                    <Text style={[styles.themeOptionText, filters.theme === null && styles.themeOptionTextActive]}>
                      Tous les thèmes
                    </Text>
                  </Pressable>
                  {availableThemes.map((theme) => (
                    <Pressable
                      key={theme}
                      style={[styles.themeOption, filters.theme === theme && styles.themeOptionActive]}
                      onPress={() => updateFilter("theme", theme)}
                    >
                      <Text style={[styles.themeOptionText, filters.theme === theme && styles.themeOptionTextActive]}>
                        {theme}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Note minimale</Text>
              <View style={styles.ratingOptions}>
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <Pressable
                    key={rating}
                    style={[styles.ratingOption, filters.minRating === rating && styles.ratingOptionActive]}
                    onPress={() => updateFilter("minRating", rating)}
                  >
                    <Feather name="star" size={16} color={filters.minRating === rating ? colors.surface : colors.accent} />
                    <Text style={[styles.ratingText, filters.minRating === rating && styles.ratingTextActive]}>
                      {rating === 0 ? "Toutes" : `${rating}+`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    drawer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      minHeight: "50%",
      maxHeight: "85%",
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    headerButtons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    resetButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    resetButtonText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
    },
    closeButton: {
      padding: 4,
    },
    content: {
      paddingHorizontal: 20,
    },
    section: {
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
    },
    optionsRow: {
      flexDirection: "row",
      gap: 8,
    },
    option: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.surfaceVariant,
      alignItems: "center",
    },
    optionActive: {
      backgroundColor: colors.primaryDark,
    },
    optionText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    optionTextActive: {
      color: colors.surface,
    },
    themeOptions: {
      gap: 8,
    },
    themeOption: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.surfaceVariant,
    },
    themeOptionActive: {
      backgroundColor: colors.primaryDark,
    },
    themeOptionText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    themeOptionTextActive: {
      color: colors.surface,
    },
    ratingOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    ratingOption: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: colors.surfaceVariant,
    },
    ratingOptionActive: {
      backgroundColor: colors.primary,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    ratingTextActive: {
      color: colors.surface,
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    applyButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.surface,
    },
  })

export default FilterDrawer
