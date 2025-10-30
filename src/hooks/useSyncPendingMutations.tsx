import type { Book } from "@/src/types/Book"
import api from "@/src/utils/api"
import { getPendingMutations, removePendingMutation } from "@/src/utils/offlineStorage"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { bookKeys } from "./useBooks"
import { useNetworkStatus } from "./useNetworkStatus"

export const useSyncPendingMutations = () => {
  const { isOnline } = useNetworkStatus()
  const queryClient = useQueryClient()
  const isSyncing = useRef(false)

  const syncMutations = async () => {
    if (isSyncing.current) return

    isSyncing.current = true

    try {
      const mutations = await getPendingMutations()

      if (mutations.length === 0) {
        isSyncing.current = false
        return
      }

      console.log(`Synchronisation de ${mutations.length} mutations en attente...`)

      for (const mutation of mutations) {
        try {
          if (mutation.type === "create" && mutation.book) {
            // Créer le livre sur le serveur
            const response = await api.post<Book>("/books", mutation.book)
            // Mettre à jour l'ID local avec l'ID serveur
            await removePendingMutation(mutation.id)
            console.log(`Mutation create ${mutation.id} synchronisée avec succès`)
          } else if (mutation.type === "update" && mutation.book) {
            await api.put<Book>(`/books/${mutation.book.id}`, mutation.book)
            await removePendingMutation(mutation.id)
            console.log(`Mutation update ${mutation.id} synchronisée avec succès`)
          } else if (mutation.type === "delete" && mutation.bookId) {
            await api.delete(`/books/${mutation.bookId}`)
            await removePendingMutation(mutation.id)
            console.log(`Mutation delete ${mutation.id} synchronisée avec succès`)
          } else if (mutation.type === "createNote" && mutation.note) {
            await api.post(`/books/${mutation.note.bookId}/notes`, { content: mutation.note.content })
            await removePendingMutation(mutation.id)
            console.log(`Mutation createNote ${mutation.id} synchronisée avec succès`)
          } else if (mutation.type === "deleteNote" && mutation.bookId && mutation.noteId) {
            await api.delete(`/books/${mutation.bookId}/notes/${mutation.noteId}`)
            await removePendingMutation(mutation.id)
            console.log(`Mutation deleteNote ${mutation.id} synchronisée avec succès`)
          }
        } catch (error) {
          console.error(`Erreur lors de la synchronisation de la mutation ${mutation.id}:`, error)
        }
      }

      await queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
      await queryClient.invalidateQueries({ queryKey: bookKeys.details() })

      console.log("Synchronisation terminée")
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error)
    } finally {
      isSyncing.current = false
    }
  }

  useEffect(() => {
    if (isOnline) {
      syncMutations()
    }
  }, [isOnline])

  return { syncMutations, isSyncing: isSyncing.current }
}