import { useTheme } from "@/src/contexts/ThemeContext"
import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react"
import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native"

interface RatingPickerProps {
  value: number
  onChange: (rating: number) => void
  size?: number
  color?: string
  disabled?: boolean
}

const RatingPicker = ({
  value,
  onChange,
  size = 36,
  color,
  disabled = false,
}: RatingPickerProps) => {
  const { colors } = useTheme()
  const starColor = color || colors.accent
  const styles = createStyles(colors)

  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [containerLayout, setContainerLayout] = useState<{ x: number; width: number } | null>(null)
  const [isTouching, setIsTouching] = useState(false)
  const [initialRating, setInitialRating] = useState<number | null>(null)

  const handleLayout = (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout
    setContainerLayout({ x, width })
  }

  const calculateRating = (pageX: number): number => {
    if (!containerLayout) return 0

    const relativeX = pageX - containerLayout.x

    const clampedX = Math.max(0, Math.min(containerLayout.width, relativeX))

    const ratio = clampedX / containerLayout.width

    const rating = ratio * 5
    return Math.round(rating * 2) / 2
  }

  const handleTouchStart = (event: GestureResponderEvent) => {
    if (disabled || !containerLayout) return

    setIsTouching(true)
    const rating = calculateRating(event.nativeEvent.pageX)
    setInitialRating(rating)
    setHoveredRating(rating)
  }

  const handleTouchMove = (event: GestureResponderEvent) => {
    if (disabled || !containerLayout || !isTouching) return

    const rating = calculateRating(event.nativeEvent.pageX)
    setHoveredRating(rating)
  }

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (disabled || !containerLayout) return

    const finalRating = calculateRating(event.nativeEvent.pageX)

    if (initialRating === finalRating && finalRating === value) {
      onChange(0)
    } else {
      onChange(finalRating)
    }

    setIsTouching(false)
    setHoveredRating(null)
    setInitialRating(null)
  }

  const handleTouchCancel = () => {
    setIsTouching(false)
    setHoveredRating(null)
    setInitialRating(null)
  }

  const renderStar = (index: number) => {
    const displayRating = hoveredRating ?? value
    const difference = displayRating - index

    let iconName: "star" | "star-half-o" | "star-o" = "star-o"

    if (difference >= 1) {
      iconName = "star"
    } else if (difference >= 0.5) {
      iconName = "star-half-o"
    }

    return (
      <View key={index} style={styles.starIcon}>
        <FontAwesome name={iconName} size={size} color={starColor} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View
        style={styles.starsContainer}
        onLayout={handleLayout}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {Array.from({ length: 5 }, (_, i) => renderStar(i))}
      </View>
      <View style={styles.ratingInfo}>
        <Text style={styles.ratingText}>
          {value > 0 ? `${value.toFixed(1)}/5` : "Non noté"}
        </Text>
        {value > 0 && (
          <Pressable onPress={() => onChange(0)} disabled={disabled}>
            <Text style={styles.resetText}>Réinitialiser</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.hint}>Touchez ou glissez pour noter</Text>
    </View>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      gap: 12,
      width: "100%",
    },
    starsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 8,
      width: "100%",
      minHeight: 56,
    },
    starIcon: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    ratingInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    ratingText: {
      fontSize: 18,
      color: colors.text,
      fontWeight: "600",
    },
    resetText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
    hint: {
      fontSize: 12,
      color: colors.textTertiary,
      fontStyle: "italic",
    },
  })

export default RatingPicker