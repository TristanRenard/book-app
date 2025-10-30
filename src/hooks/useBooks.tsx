import type { Book } from "@/src/types/Book"
import { OpenLibrarySearchResponse } from "@/src/types/Openlibrary"
import api from "@/src/utils/api"
import * as offlineStorage from "@/src/utils/offlineStorage"
import openLibrary from "@/src/utils/openLibrary"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNetworkStatus } from "./useNetworkStatus"

export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (filters?: string) => [...bookKeys.lists(), filters] as const,
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (id: number) => [...bookKeys.details(), id] as const,
}

const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await api.get<Book[]>("/books")
    await offlineStorage.saveBooks(response.data)
    return response.data
  } catch (error) {

    console.log("Récupération des livres depuis le stockage local")
    const localBooks = await offlineStorage.getBooks()
    if (localBooks) {
      return localBooks
    }
    throw error
  }
}


const fetchBook = async (id: number): Promise<Book> => {
  try {
    const response = await api.get<Book>(`/books/${id}`)
    await offlineStorage.saveBook(response.data)
    return response.data
  } catch (error) {

    console.log("Récupération du livre depuis le stockage local")
    const localBook = await offlineStorage.getBook(id)
    if (localBook) {
      return localBook
    }
    throw error
  }
}

const updateBook = async (book: Book, isOnline: boolean): Promise<Book> => {
  if (isOnline) {
    try {
      const response = await api.put<Book>(`/books/${book.id}`, book)
      await offlineStorage.saveBook(response.data)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la mise à jour en ligne, sauvegarde hors ligne")
      await offlineStorage.addPendingMutation({
        type: "update",
        book,
      })
      await offlineStorage.saveBook(book)
      return book
    }
  } else {
    console.log("Mode hors ligne : sauvegarde de la mutation")
    await offlineStorage.addPendingMutation({
      type: "update",
      book,
    })
    await offlineStorage.saveBook(book)
    return book
  }
}

const updateBookCover = async (book: Book): Promise<Book | null> => {
  if (book.cover) return null

  const response = await openLibrary.get<OpenLibrarySearchResponse>(
    `/search.json?title=${encodeURIComponent(book.name)}`
  )

  const cover = response.data.docs[0]?.cover_i
    ? `https://covers.openlibrary.org/b/id/${response.data.docs[0].cover_i}-L.jpg`
    : null

  if (!cover) return null

  const updatedBook = { ...book, cover }
  const updateResponse = await api.put<Book>(`/books/${book.id}`, updatedBook)
  await offlineStorage.saveBook(updateResponse.data)
  return updateResponse.data
}

export const useBooks = () => {
  return useQuery({
    queryKey: bookKeys.lists(),
    queryFn: fetchBooks,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useBook = (id: number) => {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => fetchBook(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useUpdateBook = () => {
  const queryClient = useQueryClient()
  const { isOnline } = useNetworkStatus()

  return useMutation({
    mutationFn: (book: Book) => updateBook(book, isOnline),
    onSuccess: (data: Book) => {
      queryClient.setQueryData(bookKeys.detail(data.id), data)
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
  })
}

export const useToggleFavorite = () => {
  const queryClient = useQueryClient()
  const { isOnline } = useNetworkStatus()

  return useMutation({
    mutationFn: async (book: Book) => {
      const updatedBook: Book = { ...book, favorite: !book.favorite }
      return updateBook(updatedBook, isOnline)
    },
    onMutate: async (book: Book) => {
      await queryClient.cancelQueries({ queryKey: bookKeys.detail(book.id) })
      const previousBook = queryClient.getQueryData(bookKeys.detail(book.id))

      const updatedBook = { ...book, favorite: !book.favorite }
      queryClient.setQueryData(bookKeys.detail(book.id), updatedBook)

      return { previousBook }
    },
    onError: (_: null, book: Book, context: { previousBook: Book | null }) => {
      if (context?.previousBook) {
        queryClient.setQueryData(bookKeys.detail(book.id), context.previousBook)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
  })
}

export const useToggleRead = () => {
  const queryClient = useQueryClient()
  const { isOnline } = useNetworkStatus()

  return useMutation({
    mutationFn: async (book: Book) => {
      const updatedBook: Book = { ...book, read: !book.read }
      return updateBook(updatedBook, isOnline)
    },
    onMutate: async (book: Book) => {
      await queryClient.cancelQueries({ queryKey: bookKeys.detail(book.id) })
      const previousBook = queryClient.getQueryData(bookKeys.detail(book.id))

      const updatedBook = { ...book, read: !book.read }
      queryClient.setQueryData(bookKeys.detail(book.id), updatedBook)

      return { previousBook }
    },
    onError: (_: null, book: Book, context: { previousBook: Book | null }) => {
      if (context?.previousBook) {
        queryClient.setQueryData(bookKeys.detail(book.id), context.previousBook)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
  })
}

export const useUpdateBookCovers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (books: Book[]) => {
      const booksWithoutCovers = books.filter(book => !book.cover)
      const updates = await Promise.all(
        booksWithoutCovers.map(book => updateBookCover(book))
      )
      return updates.filter((book): book is Book => book !== null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
  })
}