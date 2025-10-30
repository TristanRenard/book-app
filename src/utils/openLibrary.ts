import axios from "axios"

const openLibrary = axios.create({
  baseURL: process.env.EXPO_PUBLIC_OPEN_LIBRARY_URL || "https://openlibrary.org",
})

export default openLibrary