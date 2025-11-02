import { useTheme } from "@/src/contexts/ThemeContext"
import { Dimensions } from "react-native"
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CHART_WIDTH = SCREEN_WIDTH - 40
const CHART_HEIGHT = 250

type ModernBarChartProps = {
  data: number[]
  labels: string[]
  colors?: string[]
}

const ModernBarChart = ({ data, labels, colors: customColors }: ModernBarChartProps) => {
  const { colors } = useTheme()
  const barColors = customColors || [colors.primary, colors.primary, colors.primary, colors.primary, colors.primary, colors.primary]
  const maxValue = Math.max(...data, 1)
  const barWidth = (CHART_WIDTH - 80) / data.length - 12

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <G>
        {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => {
          const y = 200 - fraction * 160
          return (
            <G key={i}>
              <Line x1="50" y1={y} x2={CHART_WIDTH - 20} y2={y} stroke={colors.borderLight} strokeWidth="1" />
              <SvgText x="35" y={y + 5} fontSize="10" fill={colors.textTertiary} textAnchor="end">
                {Math.round(maxValue * fraction)}
              </SvgText>
            </G>
          )
        })}

        {data.map((value, index) => {
          const height = (value / maxValue) * 160
          const x = 60 + index * (barWidth + 12)
          const y = 200 - height

          return (
            <G key={index}>
              <Rect x={x} y={y} width={barWidth} height={height} fill={barColors[index % barColors.length]} rx="6" />
              {value > 0 && (
                <SvgText x={x + barWidth / 2} y={y - 8} fontSize="14" fontWeight="600" fill={colors.text} textAnchor="middle">
                  {value}
                </SvgText>
              )}
              <SvgText x={x + barWidth / 2} y="225" fontSize="14" fill={colors.textSecondary} textAnchor="middle">
                {labels[index]}
              </SvgText>
            </G>
          )
        })}
      </G>
    </Svg>
  )
}

export default ModernBarChart