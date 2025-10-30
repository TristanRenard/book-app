import { FontAwesome } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"

interface StarRatingProps {
  rating: number
  size?: number
  color?: string
}

const StarRating = ({ rating, size = 20, color = "#FFD700" }: StarRatingProps) => {
  const renderStar = (index: number) => {
    const difference = rating - index

    if (difference >= 1) {
      return <FontAwesome key={index} name="star" size={size} color={color} />
    }

    if (difference >= 0.5) {
      return <FontAwesome key={index} name="star-half-o" size={size} color={color} />
    }

    return <FontAwesome key={index} name="star-o" size={size} color={color} />
  }

  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }, (_, i) => renderStar(i))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
  },
})

export default StarRating