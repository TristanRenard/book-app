import { useTheme } from "@/src/contexts/ThemeContext"
import { StyleSheet, Text, View } from "react-native"
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg"

type CircularProgressProps = {
  percentage: number
  readCount: number
  totalBooks: number
}

const CircularProgress = ({ percentage, readCount, totalBooks }: CircularProgressProps) => {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const size = 180
  const strokeWidth = 12
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progressOffset = circumference - (percentage / 100) * circumference

  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.surfaceVariant}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>

        <View style={styles.content}>
          <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
          <Text style={styles.label}>de lecture</Text>
          <View style={styles.divider} />
          <Text style={styles.count}>{readCount} / {totalBooks}</Text>
          <Text style={styles.subLabel}>livres lus</Text>
        </View>
      </View>
    </View>
  )
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    svgWrapper: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    percentage: {
      fontSize: 42,
      fontWeight: "700",
      color: colors.primary,
      letterSpacing: -1,
    },
    label: {
      fontSize: 13,
      color: colors.textTertiary,
      marginTop: 2,
      fontWeight: "500",
    },
    divider: {
      width: 40,
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 10,
    },
    count: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    subLabel: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: 2,
    },
  })

export default CircularProgress