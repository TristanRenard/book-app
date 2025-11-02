import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"

type ThemeMode = "light" | "dark" | "system"
type ActiveTheme = "light" | "dark"

interface ThemeContextType {
  themeMode: ThemeMode
  activeTheme: ActiveTheme
  setThemeMode: (mode: ThemeMode) => void
  colors: ColorScheme
}

interface ColorScheme {
  background: string
  surface: string
  surfaceVariant: string
  text: string
  textSecondary: string
  textTertiary: string
  primary: string
  primaryLight: string
  primaryDark: string
  accent: string
  accentLight: string
  favorite: string
  read: string
  error: string
  warning: string
  success: string
  border: string
  borderLight: string
  disabled: string
  shadow: string
}

const lightColors: ColorScheme = {
  background: "#ffffff",
  surface: "#ffffff",
  surfaceVariant: "#f5f5f5",

  text: "#000000",
  textSecondary: "#666666",
  textTertiary: "#999999",

  primary: "#F9A825",
  primaryLight: "#FFF8E1",
  primaryDark: "#8D6E63",

  accent: "#FDD835",
  accentLight: "#FFF8E1",

  favorite: "#FDD835",
  read: "#8D6E63",
  error: "#FF5252",
  warning: "#FF9800",
  success: "#4CAF50",

  border: "#e0e0e0",
  borderLight: "#f0f0f0",

  disabled: "#cccccc",
  shadow: "#000000",
}

const darkColors: ColorScheme = {
  background: "#121212",
  surface: "#1e1e1e",
  surfaceVariant: "#2a2a2a",

  text: "#ffffff",
  textSecondary: "#b0b0b0",
  textTertiary: "#808080",

  primary: "#FFB74D",
  primaryLight: "#3a3a2a",
  primaryDark: "#A1887F",

  accent: "#FFD54F",
  accentLight: "#3a3a2a",

  favorite: "#FFD54F",
  read: "#A1887F",
  error: "#EF5350",
  warning: "#FFA726",
  success: "#66BB6A",

  border: "#3a3a3a",
  borderLight: "#2a2a2a",

  disabled: "#555555",
  shadow: "#000000",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = "@books_theme_mode"

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme()
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system")

  const activeTheme: ActiveTheme =
    themeMode === "system"
      ? (systemColorScheme as ActiveTheme) || "light"
      : themeMode

  const colors = activeTheme === "dark" ? darkColors : lightColors

  useEffect(() => {
    loadThemeMode()
  }, [])

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      if (savedMode && (savedMode === "light" || savedMode === "dark" || savedMode === "system")) {
        setThemeModeState(savedMode as ThemeMode)
      }
    } catch (error) {
      console.error("Error loading theme mode:", error)
    }
  }

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
      setThemeModeState(mode)
    } catch (error) {
      console.error("Error saving theme mode:", error)
    }
  }

  return (
    <ThemeContext.Provider value={{ themeMode, activeTheme, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
