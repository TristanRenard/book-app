import type { Note } from "@/src/types/Note"
import api from "@/src/utils/api"
import * as offlineStorage from "@/src/utils/offlineStorage"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNetworkStatus } from "./useNetworkStatus"

export const noteKeys = {
  all: ["notes"] as const,
  lists: () => [...noteKeys.all, "list"] as const,
  list: (bookId: number) => [...noteKeys.lists(), bookId] as const,
}

const fetchNotes = async (bookId: number): Promise<Note[]> => {
  try {
    const response = await api.get<Note[]>(`/books/${bookId}/notes`)
    await offlineStorage.saveNotes(bookId, response.data)
    return response.data
  } catch (error) {
    console.log("Récupération des notes depuis le stockage local")
    const localNotes = await offlineStorage.getNotes(bookId)
    if (localNotes) {
      return localNotes
    }
    throw error
  }
}

const createNote = async (bookId: number, content: string, isOnline: boolean): Promise<Note> => {
  if (isOnline) {
    try {
      const response = await api.post<Note>(`/books/${bookId}/notes`, { content })
      await offlineStorage.saveNote(bookId, response.data)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la création en ligne, sauvegarde hors ligne")
      const tempNote: Note = {
        id: Date.now(),
        bookId,
        content,
        dateISO: new Date().toISOString(),
      }
      await offlineStorage.addPendingMutation({
        type: "createNote",
        note: tempNote,
      })
      await offlineStorage.saveNote(bookId, tempNote)
      return tempNote
    }
  } else {
    console.log("Mode hors ligne : sauvegarde de la nouvelle note")
    const tempNote: Note = {
      id: Date.now(),
      bookId,
      content,
      dateISO: new Date().toISOString(),
    }
    await offlineStorage.addPendingMutation({
      type: "createNote",
      note: tempNote,
    })
    await offlineStorage.saveNote(bookId, tempNote)
    return tempNote
  }
}

export const useNotes = (bookId: number) => {
  return useQuery({
    queryKey: noteKeys.list(bookId),
    queryFn: () => fetchNotes(bookId),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateNote = () => {
  const queryClient = useQueryClient()
  const { isOnline } = useNetworkStatus()

  return useMutation({
    mutationFn: ({ bookId, content }: { bookId: number; content: string }) =>
      createNote(bookId, content, isOnline),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.list(variables.bookId) })
    },
  })
}