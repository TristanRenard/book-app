import type { Book } from "@/src/types/Book"
import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEYS = {
  BOOKS: "@books",
  NOTES: "@notes",
  PENDING_MUTATIONS: "@pending_mutations",
} as const

export interface PendingMutation {
  id: string
  type: "create" | "update" | "delete" | "toggleFavorite" | "toggleRead" | "createNote" | "deleteNote"
  book?: Book
  bookId?: number
  note?: { id: number; bookId: number; content: string; dateISO: string }
  noteId?: number
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

export const deleteBook = async (id: number): Promise<void> => {
  try {
    const books = await getBooks() || []
    const filtered = books.filter(b => b.id !== id)
    await saveBooks(filtered)
  } catch (error) {
    console.error("Erreur lors de la suppression du livre:", error)
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

export const saveNotes = async (bookId: number, notes: { id: number; bookId: number; content: string; dateISO: string }[]): Promise<void> => {
  try {
    const key = `${STORAGE_KEYS.NOTES}_${bookId}`
    await AsyncStorage.setItem(key, JSON.stringify(notes))
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des notes:", error)
  }
}

export const getNotes = async (bookId: number): Promise<{ id: number; bookId: number; content: string; dateISO: string }[] | null> => {
  try {
    const key = `${STORAGE_KEYS.NOTES}_${bookId}`
    const data = await AsyncStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error)
    return null
  }
}

export const saveNote = async (bookId: number, note: { id: number; bookId: number; content: string; dateISO: string }): Promise<void> => {
  try {
    const notes = await getNotes(bookId) || []
    const index = notes.findIndex(n => n.id === note.id)

    if (index !== -1) {
      notes[index] = note
    } else {
      notes.push(note)
    }

    await saveNotes(bookId, notes)
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la note:", error)
  }
}

export const deleteNote = async (bookId: number, noteId: number): Promise<void> => {
  try {
    const notes = await getNotes(bookId) || []
    const filtered = notes.filter(n => n.id !== noteId)
    await saveNotes(bookId, filtered)
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error)
  }
}