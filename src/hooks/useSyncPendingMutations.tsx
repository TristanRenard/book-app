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
          await api.put<Book>(`/books/${mutation.book.id}`, mutation.book)
          await removePendingMutation(mutation.id)
          console.log(`Mutation ${mutation.id} synchronisée avec succès`)
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