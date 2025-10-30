import type { Book } from "@/src/types/Book"
import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEYS = {
  BOOKS: "@books",
  PENDING_MUTATIONS: "@pending_mutations",
} as const

export interface PendingMutation {
  id: string
  type: "update" | "toggleFavorite" | "toggleRead"
  book: Book
  timestamp: number
}

export const saveBooks = async (books: Book[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books))
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des livres:", error)
  }
}

export const getBooks = async (): Promise<Book[] | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKS)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Erreur lors de la récupération des livres:", error)
    return null
  }
}

export const saveBook = async (book: Book): Promise<void> => {
  try {
    const books = await getBooks() || []
    const index = books.findIndex(b => b.id === book.id)

    if (index !== -1) {
      books[index] = book
    } else {
      books.push(book)
    }

    await saveBooks(books)
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du livre:", error)
  }
}

export const getBook = async (id: number): Promise<Book | null> => {
  try {
    const books = await getBooks()
    return books?.find(b => b.id === id) || null
  } catch (error) {
    console.error("Erreur lors de la récupération du livre:", error)
    return null
  }
}

export const addPendingMutation = async (mutation: Omit<PendingMutation, "id" | "timestamp">): Promise<void> => {
  try {
    const mutations = await getPendingMutations()
    const newMutation: PendingMutation = {
      ...mutation,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
    }

    mutations.push(newMutation)
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_MUTATIONS, JSON.stringify(mutations))
  } catch (error) {
    console.error("Erreur lors de l'ajout de la mutation:", error)
  }
}

export const getPendingMutations = async (): Promise<PendingMutation[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_MUTATIONS)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Erreur lors de la récupération des mutations:", error)
    return []
  }
}

export const removePendingMutation = async (id: string): Promise<void> => {
  try {
    const mutations = await getPendingMutations()
    const filtered = mutations.filter(m => m.id !== id)
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_MUTATIONS, JSON.stringify(filtered))
  } catch (error) {
    console.error("Erreur lors de la suppression de la mutation:", error)
  }
}

export const clearPendingMutations = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_MUTATIONS, JSON.stringify([]))
  } catch (error) {
    console.error("Erreur lors de la suppression des mutations:", error)
  }
}