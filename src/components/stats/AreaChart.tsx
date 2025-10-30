import { Dimensions } from "react-native"
import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Stop, Text as SvgText } from "react-native-svg"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CHART_WIDTH = SCREEN_WIDTH - 40
const CHART_HEIGHT = 250

type AreaChartProps = {
  data: number[]
  labels: string[]
  color?: string
}

const AreaChart = ({ data, labels, color = "#007AFF" }: AreaChartProps) => {
  const maxValue = Math.max(...data, 1)
  const points = data.map((value, index) => {
    const x = 50 + (index * (CHART_WIDTH - 80)) / (data.length - 1)
    const y = 180 - (value / maxValue) * 140
    return { x, y, value }
  })

  const linePath = points
    .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
    .join(" ")

  const areaPath = `${linePath} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Defs>
        <RadialGradient id="areaGradient" cx="50%" cy="0%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </RadialGradient>
      </Defs>
      <G>
        {[0, 0.5, 1].map((fraction, i) => {
          const y = 180 - fraction * 140
          return <Line key={i} x1="40" y1={y} x2={CHART_WIDTH - 20} y2={y} stroke="#f0f0f0" strokeWidth="1" />
        })}

        <Path d={areaPath} fill="url(#areaGradient)" />
        <Path d={linePath} stroke={color} strokeWidth="3" fill="none" />

        {points.map((point, index) => (
          <G key={index}>
            <Circle cx={point.x} cy={point.y} r="6" fill="#fff" stroke={color} strokeWidth="3" />
            <SvgText x={point.x} y={point.y - 15} fontSize="12" fontWeight="600" fill="#000" textAnchor="middle">
              {point.value}
            </SvgText>
            <SvgText x={point.x} y="220" fontSize="11" fill="#666" textAnchor="middle">
              {labels[index]}
            </SvgText>
          </G>
        ))}
      </G>
    </Svg>
  )
}

export default AreaChart