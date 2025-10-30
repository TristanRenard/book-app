import { getThemeColor } from "@/src/utils/colorUtils"
import { Dimensions, Platform, Pressable, View } from "react-native"
import Svg, { Circle, Defs, Path, RadialGradient, Stop, Text as SvgText } from "react-native-svg"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const SUNBURST_SIZE = Math.min(SCREEN_WIDTH - 80, 300)

type Book = {
  read: boolean
  theme?: string
  favorite: boolean
  [key: string]: any
}

type MultiLevelSunburstProps = {
  books: Book[]
  onThemePress: (theme: string) => void
}

type Segment = {
  level: number
  startAngle: number
  endAngle: number
  innerRadius: number
  outerRadius: number
  color: string
  themeName: string | null
}

const MultiLevelSunburst = ({ books, onThemePress }: MultiLevelSunburstProps) => {
  const centerX = SUNBURST_SIZE / 2
  const centerY = SUNBURST_SIZE / 2

  const level1InnerRadius = SUNBURST_SIZE * 0.25
  const level1OuterRadius = SUNBURST_SIZE * 0.32
  const level2InnerRadius = SUNBURST_SIZE * 0.34
  const level2OuterRadius = SUNBURST_SIZE * 0.41
  const level3InnerRadius = SUNBURST_SIZE * 0.43
  const level3OuterRadius = SUNBURST_SIZE * 0.48

  const readBooks = books.filter((b) => b.read)
  const unreadBooks = books.filter((b) => !b.read)

  const level1Data = [
    { name: "Lus", count: readBooks.length, color: "#4CAF50", books: readBooks },
    { name: "Non lus", count: unreadBooks.length, color: "#9E9E9E", books: unreadBooks },
  ]

  let currentAngle = -Math.PI / 2
  const segments: Segment[] = []

  level1Data.forEach((level1Item) => {
    if (level1Item.count === 0) return

    const level1Percentage = level1Item.count / books.length
    const level1Angle = level1Percentage * 2 * Math.PI
    const level1StartAngle = currentAngle
    const level1EndAngle = currentAngle + level1Angle

    segments.push({
      level: 1,
      startAngle: level1StartAngle,
      endAngle: level1EndAngle,
      innerRadius: level1InnerRadius,
      outerRadius: level1OuterRadius,
      color: level1Item.color,
      themeName: null,
    })

    const themeStats = level1Item.books.reduce((acc, book) => {
      const theme = book.theme || "Sans thème"
      if (!acc[theme]) acc[theme] = []
      acc[theme].push(book)
      return acc
    }, {} as Record<string, Book[]>)

    const themes = Object.entries(themeStats).sort((a, b) => b[1].length - a[1].length)
    let level2CurrentAngle = level1StartAngle

    themes.forEach(([theme, themeBooks]) => {
      const level2Percentage = themeBooks.length / level1Item.count
      const level2Angle = level2Percentage * level1Angle
      const level2StartAngle = level2CurrentAngle
      const level2EndAngle = level2CurrentAngle + level2Angle

      const baseColor = getThemeColor(theme)

      segments.push({
        level: 2,
        startAngle: level2StartAngle,
        endAngle: level2EndAngle,
        innerRadius: level2InnerRadius,
        outerRadius: level2OuterRadius,
        color: baseColor,
        themeName: theme,
      })

      const favoriteBooks = themeBooks.filter((b) => b.favorite)
      const nonFavoriteBooks = themeBooks.filter((b) => !b.favorite)

      let level3CurrentAngle = level2StartAngle

      const level3Data = [
        { books: favoriteBooks, color: "#FF5252" },
        { books: nonFavoriteBooks, color: "#E0E0E0" },
      ]

      level3Data.forEach((level3Item) => {
        if (level3Item.books.length === 0) return

        const level3Percentage = level3Item.books.length / themeBooks.length
        const level3Angle = level3Percentage * level2Angle
        const level3StartAngle = level3CurrentAngle
        const level3EndAngle = level3CurrentAngle + level3Angle

        segments.push({
          level: 3,
          startAngle: level3StartAngle,
          endAngle: level3EndAngle,
          innerRadius: level3InnerRadius,
          outerRadius: level3OuterRadius,
          color: level3Item.color,
          themeName: null,
        })

        level3CurrentAngle = level3EndAngle
      })

      level2CurrentAngle = level2EndAngle
    })

    currentAngle = level1EndAngle
  })

  const isPointInSegment = (x: number, y: number, segment: Segment) => {
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < segment.innerRadius || distance > segment.outerRadius) {
      return false
    }

    let angle = Math.atan2(dy, dx)
    if (angle < segment.startAngle) angle += 2 * Math.PI

    return angle >= segment.startAngle && angle <= segment.endAngle
  }

  const handlePress = (evt: any) => {
    let locationX: number
    let locationY: number

    if (Platform.OS === 'web') {
      const target = evt.currentTarget
      const rect = target.getBoundingClientRect()
      locationX = evt.clientX - rect.left
      locationY = evt.clientY - rect.top
    } else {
      locationX = evt.nativeEvent.locationX
      locationY = evt.nativeEvent.locationY
    }

    for (const segment of segments) {
      if (segment.level === 2 && segment.themeName) {
        if (isPointInSegment(locationX, locationY, segment)) {
          onThemePress(segment.themeName)
          break
        }
      }
    }
  }

  return (
    <Pressable onPress={handlePress}>
      <View pointerEvents="box-only">
        <Svg width={SUNBURST_SIZE} height={SUNBURST_SIZE}>
          <Defs>
            <RadialGradient id="centerGradient" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="#F5F5F5" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </RadialGradient>
          </Defs>

          <Circle cx={centerX} cy={centerY} r={level1InnerRadius} fill="url(#centerGradient)" />
          <Circle
            cx={centerX}
            cy={centerY}
            r={level1InnerRadius}
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="2"
          />

          {segments.map((segment, index) => {
            const { startAngle, endAngle, innerRadius, outerRadius, color, level } = segment
            const angle = endAngle - startAngle

            const x1 = centerX + innerRadius * Math.cos(startAngle)
            const y1 = centerY + innerRadius * Math.sin(startAngle)
            const x2 = centerX + outerRadius * Math.cos(startAngle)
            const y2 = centerY + outerRadius * Math.sin(startAngle)
            const x3 = centerX + outerRadius * Math.cos(endAngle)
            const y3 = centerY + outerRadius * Math.sin(endAngle)
            const x4 = centerX + innerRadius * Math.cos(endAngle)
            const y4 = centerY + innerRadius * Math.sin(endAngle)

            const largeArcFlag = angle > Math.PI ? 1 : 0

            const pathData = [
              `M ${x1} ${y1}`,
              `L ${x2} ${y2}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
              `L ${x4} ${y4}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
              "Z",
            ].join(" ")

            return (
              <Path
                key={`segment-${index}`}
                d={pathData}
                fill={color}
                opacity={level === 1 ? 1 : level === 2 ? 0.9 : 0.85}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            )
          })}

          <Circle
            cx={centerX}
            cy={centerY}
            r={level1OuterRadius}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <Circle
            cx={centerX}
            cy={centerY}
            r={level2OuterRadius}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
          />

          <SvgText
            x={centerX}
            y={centerY - 10}
            fontSize="32"
            fontWeight="bold"
            fill="#007AFF"
            textAnchor="middle"
          >
            {books.length}
          </SvgText>
          <SvgText x={centerX} y={centerY + 15} fontSize="14" fill="#666" textAnchor="middle">
            Livres
          </SvgText>
        </Svg>
      </View>
    </Pressable>
  )
}

export default MultiLevelSunburst