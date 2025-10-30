export const getThemeColor = (themeName: string, baseHue: number = 210): string => {
  let hash = 0
  for (let i = 0; i < themeName.length; i++) {
    hash = themeName.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }

  const hueVariation = (Math.abs(hash) % 60) - 30
  const hue = (baseHue + hueVariation + 360) % 360

  const saturation = 70 + (Math.abs(hash >> 8) % 15)

  const lightnessVariations = [45, 55, 40, 60, 50, 65, 42, 58]
  const lightness = lightnessVariations[Math.abs(hash >> 16) % lightnessVariations.length]

  return hslToHex(hue, saturation, lightness)
}

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export const generateThemeColors = (themes: string[], baseHue: number = 210): Record<string, string> => {
  return themes.reduce((acc, theme) => {
    acc[theme] = getThemeColor(theme, baseHue)
    return acc
  }, {} as Record<string, string>)
}